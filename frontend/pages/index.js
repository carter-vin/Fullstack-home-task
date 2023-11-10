// pages/index.js

import React, { useState } from 'react';
import styles from '../styles/Home.module.css'; // Make sure to create this CSS module.

export default function Home() {
  const [file, setFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      const fileExtension = getFileExtension(file.name);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`http://0.0.0.0:5000/upload/${fileExtension}/`, { // Replace with your actual backend URL
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        setAnalysisResults(data);  // Assuming you have a state variable to store the results
      } catch (error) {
        console.error("Failed to analyze the file:", error);
        // Handle errors here, e.g., show an error message to the user
      }
    }
  };

  function getFileExtension(fileName) {
    // Split the filename by '.', and get the last element
    const parts = fileName.split('.');
    return parts[parts.length - 1];
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Plasmid Sequence Analysis Tool</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="fileInput" className={styles.title}>Upload DNA Sequence File:</label>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            accept=".fasta, .bam"
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Analyze File</button>
      </form>
    </div>
  );
}
