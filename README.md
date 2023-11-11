# Overview of This Test Project

This project is a web-based application designed to analyze Plasmid DNA sequences. The backend, built with FastAPI, handles the processing of FASTA and BAM files, providing insights such as sequence length, GC content, and reverse complement. The frontend, developed using React and Next.js, offers a user-friendly interface for users to upload DNA sequence files and view the analysis results. The project is containerized using Docker, ensuring easy setup and consistent performance across different environments.

## Structure of This Codebase

The codebase is divided into two main parts: the backend and the frontend.

## Backend (/backend):
 - Contains FastAPI application code.
 - Responsible for processing DNA sequence files and returning analysis results.
 - Includes Dockerfile for containerization.

## Frontend (/frontend):
 - Developed with React and Next.js.
 - Provides the user interface for file upload and displays analysis results.
 - Includes Dockerfile for containerization.

## Prerequisites
 - Docker
 - Docker Compose (usually included with Docker Desktop)

## Installing and Running
Follow these steps to get your development environment running:

1- Clone the Repository
Clone the repository to your local machine.
 - `git clone [repository URL]`

2- Navigate to the Project Directory
Change into the project directory.
 - cd [project-name]

3- Build and Run with Docker Compose
Use Docker Compose to build and start the services.
 - `docker-compose up --build`

4- Accessing the Application
 - The frontend will be accessible at http://localhost:3000.
 - The backend will be accessible at http://localhost:5000.

5- Stopping the Application
To stop the application, run:
 - `docker-compose down`