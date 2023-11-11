// pages/index.js

import React, { useState } from 'react';
import styles from '../styles/Home.module.css'; // Make sure to create this CSS module.
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function Home() {
  const [file, setFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isSequenceVisible, setIsSequenceVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset error message
    setErrorMessage('');
    if (!file) {
      setErrorMessage('Please select a file to analyze.');
      return;
    }

    // Fetch file data by calling API
    const fileExtension = getFileExtension(file.name);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`http://0.0.0.0:5000/upload/${fileExtension}/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (error) {
      console.error("Failed to analyze the file:", error);
    }
  };

  function getFileExtension(fileName) {
    // Split the filename by '.', and get the last element
    const parts = fileName.split('.');
    return parts[parts.length - 1];
  }

  const histogramChart = analysisResults && analysisResults.histogram_data ? (
    <Bar
      data={{
        labels: Object.keys(analysisResults.histogram_data),
        datasets: [{
          label: 'Read Lengths',
          data: Object.values(analysisResults.histogram_data),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }],
      }}
      options={{
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }}
    />
  ) : null;

  const formatSequence = (sequence) => {
    const chunkSize = 50; // Adjust the chunk size as needed
    const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
    return sequence.match(regex).join(' ');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Plasmid Sequence Analysis Tool</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <div className={styles.instructions}>
            <p>Welcome to the Plasmid Sequence Analysis Tool. Please upload a FASTA or BAM file to get started.</p>
          </div>
          <label htmlFor="fileInput" className={styles.title}>Upload DNA Sequence File:</label>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            accept=".fasta, .bam"
            className={styles.input}
          />
          <div className={styles.errorMessage}>{errorMessage}</div>
        </div>
        <button type="submit" className={styles.button}>Analyze File</button>
      </form>
      {analysisResults && (
        <div className={styles.results}>
          <h2 className={styles.margins}>Analysis Results</h2>
          <p className={styles.margins}>Sequence Length: {analysisResults.sequence_length}</p>
          <p className={styles.margins}>G/C Content: {analysisResults.gc_content.toFixed(2)}%</p>
          <div className={styles.margins}>
            <button onClick={() => setIsSequenceVisible(!isSequenceVisible)}>
              {isSequenceVisible ? 'Hide' : 'Show'} Reverse Complement
            </button>
            {isSequenceVisible && <p>Reverse Complement: {formatSequence(analysisResults.reverse_complement)}</p>}
          </div>

          {/* Conditionally display BAM file specific results */}
          {analysisResults.reads_count && (
            <>
              <p className={styles.margins}>Reads Count: {analysisResults.reads_count}</p>
              {/* Optionally display histogram data */}
              {analysisResults.histogram_data && (
                <div className={styles.margins}>
                  <h3>Histogram of Read Lengths</h3>
                  {histogramChart}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
