from collections import Counter
import os
import logging
import re
import tempfile
from typing import Tuple
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from Bio import SeqIO
from io import StringIO
import pysam
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Plasmid DNA Sequence Analysis API",
    summary="API endpoints include sequence analysis of FASTA and BAM files.",
)

ALLOWED_EXTENSIONS = {"fasta", "fas", "fa", "bam"}
SUPPORTED_BAM_FORMAT = ".bam"


def allowed_file(filename: str) -> bool:
    return filename.lower().endswith(tuple(ALLOWED_EXTENSIONS))


def is_valid_fasta(content: bytes) -> Tuple[bool, SeqRecord]:
    try:
        fasta_io = StringIO(content.decode("utf-8"))
        sequence_record = SeqIO.read(fasta_io, "fasta")
        return True, sequence_record
    except Exception as error:
        logger.error(f"Error reading FASTA: {error}")
        return False, None


def is_valid_bam(bam_file: str) -> bool:
    try:
        bam_file = pysam.AlignmentFile(bam_file, "rb")
        return bam_file.is_bam
    except Exception as error:
        logger.error(f"Error reading BAM file: {error}")
        return False


def is_valid_dna_sequence(sequence: Seq) -> bool:
    valid_dna_pattern = re.compile(r"^[ATCGatcg]+$")
    return bool(sequence and valid_dna_pattern.match(str(sequence.seq)))


def analyze_fasta(sequence_record: SeqRecord) -> JSONResponse:
    try:
        sequence_length = len(sequence_record.seq)
        gc_count = sequence_record.seq.count("G") + sequence_record.seq.count("C")
        gc_content = (gc_count / sequence_length) * 100
        reverse_complement = sequence_record.seq.reverse_complement()

        return JSONResponse(
            content={
                "sequence_length": sequence_length,
                "gc_content": gc_content,
                "reverse_complement": str(reverse_complement),
            }
        )
    except Exception as error:
        logger.error(f"Error analyzing FASTA: {error}")
        return JSONResponse(content={"error": str(error)}, status_code=400)


def analyze_bam(bam_file: str) -> JSONResponse:
    try:
        reads_count = 0
        total_sequence_length = 0
        gc_count = 0
        at_count = 0
        reverse_complement = ""
        read_lengths = []

        with pysam.AlignmentFile(bam_file, "rb") as bam_file:
            for read in bam_file:
                read_sequence = read.query_sequence
                total_sequence_length += len(read_sequence)
                gc_count += read_sequence.count("G") + read_sequence.count("C")
                at_count += read_sequence.count("A") + read_sequence.count("T")
                reverse_complement += str(Seq(read_sequence).reverse_complement())
                reads_count += 1

                read_lengths.append(read.query_length)

        histogram_data = Counter(read_lengths)
        total_base_pairs = gc_count + at_count
        gc_content = (gc_count / total_base_pairs) * 100

        return JSONResponse(
            content={
                "sequence_length": total_sequence_length,
                "gc_content": gc_content,
                "reverse_complement": reverse_complement,
                "reads_count": reads_count,
                "histogram_data": histogram_data,
            }
        )
    except Exception as error:
        logger.error(f"Error analyzing BAM file: {error}")
        return JSONResponse(content={"error": str(error)}, status_code=400)


@app.post("/upload/fasta/")
async def upload_fasta_file(file: UploadFile):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")

    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file format")

    content = await file.read()

    if file.filename.lower().endswith((".fasta", ".fas", ".fa")):
        is_valid_fasta_file, fasta_sequence = is_valid_fasta(content)
        if is_valid_fasta_file:
            valid_dna_sequence = is_valid_dna_sequence(fasta_sequence)
            if valid_dna_sequence:
                fasta_sequence_data = analyze_fasta(fasta_sequence)
                return fasta_sequence_data
            else:
                raise HTTPException(
                    status_code=400, detail="Invalid FASTA DNA sequence content"
                )
        else:
            raise HTTPException(
                status_code=400, detail="Invalid FASTA sequence content"
            )

    raise HTTPException(status_code=400, detail="Unsupported file format")


@app.post("/upload/bam/")
async def upload_bam_file(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")

    if not file.filename.lower().endswith(SUPPORTED_BAM_FORMAT):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file format. Only {SUPPORTED_BAM_FORMAT} files are supported.",
        )

    with tempfile.NamedTemporaryFile(
        delete=False, suffix=SUPPORTED_BAM_FORMAT
    ) as temp_file:
        try:
            temp_file.write(file.file.read())
            temp_file_path = temp_file.name

            logger.info(f"Temporary file path: {temp_file_path}")

            if is_valid_bam(temp_file_path):
                result = analyze_bam(temp_file_path)
            else:
                raise HTTPException(status_code=400, detail="Invalid BAM file")

        finally:
            if temp_file_path:
                os.remove(temp_file_path)

    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=5000)
