# Project Proposal: Face Shape-Based Glasses Recommendation Web Application (React Frontend + Python Backend)

## 1. Introduction

This proposal outlines the development of a user-friendly web application for recommending eyeglass and shade styles based on facial shape analysis. The application will feature a modern **React frontend** interacting with a **Python backend API**. Building upon the research and objectives detailed in the "Face Shape-Based Glasses and Shades Recommendation System" project (ref: `docs/interim.md`), the backend will leverage an existing machine learning model provided by the client to automatically detect a user's face shape from an image uploaded via the frontend and suggest compatible eyewear styles.

The goal is to provide an intuitive, responsive, and efficient tool that simplifies the eyewear selection process for users by offering personalized, data-driven recommendations through a standard web application architecture.

## 2. Project Scope & Deliverables

The project will deliver the following components:

1.  **React Frontend Application:**
    *   A responsive single-page application (SPA) built using the React framework.
    *   User interface allowing image uploads (JPG, PNG formats) via a file input.
    *   Client-side logic to send the uploaded image to the backend API.
    *   Display of the uploaded image preview.
    *   Display of the predicted face shape and corresponding recommended eyeglass/shade styles received from the backend API.
    *   User feedback mechanisms (e.g., loading indicators, error messages).
    *   Basic styling for a clean user experience.
2.  **Python Backend API:**
    *   A RESTful API server built using Python (e.g., with Flask or FastAPI).
    *   An API endpoint (e.g., `/predict`) to receive image uploads from the frontend.
    *   Integration of the client-provided face shape detection model.
    *   Backend logic for face detection, image preprocessing (compatible with the provided model), face shape prediction, and recommendation generation.
    *   Returns JSON responses containing the predicted face shape and recommendations.
    *   Appropriate CORS (Cross-Origin Resource Sharing) configuration to allow requests from the frontend domain.
    *   Basic error handling for API requests and internal processing.
3.  **Technical Report:**
    *   A document detailing the application's architecture (frontend and backend), technologies used, API specification, model integration process, and instructions for setup, building, and running both components.
    *   Explanation of the recommendation logic implemented in the backend.

## 3. Technology Stack

*   **Frontend Framework:** React.js
*   **Frontend Language:** JavaScript/TypeScript
*   **Backend Framework:** Python with Flask or FastAPI
*   **Backend Language:** Python
*   **Core Libraries (Backend):** OpenCV (for image processing/face detection), Pillow (for image handling), ML library dependencies (as required by the client's model).
*   **API Communication:** RESTful APIs, JSON.

## 4. Pricing & Payment Terms

*   **Total Project Cost:** Rs. 25,000 (Twenty-Five Thousand Sri Lankan Rupees)
*   **Payment Schedule:**
    *   **Advance Payment:** 50% (Rs. 12,500) required upfront to initiate the project.
    *   **Final Payment:** Remaining 50% (Rs. 12,500) due upon successful completion and delivery of all project deliverables (React Frontend, Python Backend API, and Technical Report).

## 5. Intellectual Property (IP)

Upon successful completion of the project and receipt of the final payment, all intellectual property rights, including the source code for the React frontend, the Python backend API, and the technical report, will be fully transferred to the client.

## 6. Next Steps

To proceed with this project, please confirm your agreement with this proposal and arrange for the advance payment. We look forward to collaborating on this exciting application. 