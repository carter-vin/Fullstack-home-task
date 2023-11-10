
**Fullstack engineer take-home exercise**

Draft: Nov 8, 2023

This exercise is designed to be completed in roughly 3-4 hours. If that time represents an undue burden for you, please let us know, and we will try to find an alternative.

Once you’re done, please reach out to the person that sent you this to schedule an hour for code and architecture review, as well as other questions that may be relevant to the position. The code review will focus on analyzing the solution provided in terms of both algorithmic and interaction design choices, along with potential extensions and avenues for improvement.

Our preference is for solutions using Next.js and Python, but if you believe another stack will allow you to complete the challenge more effectively, we may be able to accommodate.

***

**Assignment: Build a Plasmid Sequence Analysis Tool**

**Overview:** Plasmids are crucial in biotechnology, and researchers often need to examine their sequences for various purposes. Circle Labs provides plasmid sequencing as a service to our clients. As part of this service, intake, analysis, and return of DNA-based information is integral. 

In this assignment, you will create a web-based tool for biotech researchers to analyze plasmid DNA sequences. Your task is to build a simple web application, with a single function: a user should be able to upload an assembled plasmid sequence, and the application will display basic information about the sequence.

Reference files are provided

**Requirements:**

- Create a user-friendly web interface for researchers to input or upload plasmid DNA sequences.

- When the plasmid sequence is uploaded:

  - Determine if the file is a FASTA or BAM

  - If FASTA:

    - Display length of the sequence

    - G/C content (how many base pairs are GC vs AT)

    - Display the reverse complement of the sequence

    - \[optional] Other relevant information about the plasmid

      - Up to your imagination!

  - If BAM:

    - Same as above, but additionally:
    - Display the number of reads that were used to make up the assembly
    - \[optional] Display a histogram of the read lengths that make up the assembly

- \[optional] Provide the option to export the analysis results as a downloadable report.

**Data Validation and Error Handling:**

- Implement basic input validation to ensure that the sequence entered is valid DNA sequence data.
- Handle errors gracefully and provide clear error messages to the user.

**Submission:**

- Create a GitHub repository for your project and share the link with us.
- Include clear instructions on how to set up and run your application locally in the README.

**Evaluation:** Your project will be evaluated based on the following criteria:

- Code quality, organization, and readability.
- The functionality of the plasmid sequence analysis tool, including all the required features.
- Error handling and validation.
- Documentation and setup instructions.
