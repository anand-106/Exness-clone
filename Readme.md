# <p align="center">Exness Trading Platform Clone</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="#"><img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"></a>
</p>

## Introduction

This project is a cryptocurrency trading platform clone inspired by Exness. It allows users to simulate trading SOL, BTC, and ETH with real-time price updates, order management features, and candlestick charts. This platform is designed for educational purposes, strategy testing, and portfolio building.

## Table of Contents

1.  [Key Features](#key-features)
2.  [Installation Guide](#installation-guide)
3.  [Usage](#usage)
4.  [Environment Variables](#environment-variables)
5.  [Project Structure](#project-structure)
6.  [Technologies Used](#technologies-used)
7.  [License](#license)

## Key Features

*   **Real-time Price Updates:** Uses WebSockets to receive live trade data for SOL, BTC, and ETH.
*   **Order Management:** Allows users to create, manage, and close buy/sell orders with configurable margin, leverage, stop loss, and take profit.
*   **Candlestick Charts:** Displays historical price data using candlestick charts with selectable time intervals (1m, 5m, 15m).
*   **User Authentication:** Implements JWT-based authentication for user signup and signin.
*   **Asynchronous Order Processing:** Uses Bull queue to process order-related events asynchronously.
*   **Email Notifications:** Sends email notifications for order events (open, close, liquidate).
*   **Redis Integration:** Uses Redis for real-time data distribution and caching.
*   **Data Persistence:** Trade data is stored in a PostgreSQL database.
*   **Server-Sent Events:** Order updates pushed to the client with Server-Sent Events (SSE).
*   **Zustand State Management:** Uses Zustand for a simple frontend state management.

## Installation Guide

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    cd ../httpServer
    npm install
    cd ../Price-Websocket
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd frontend
    npm install
    ```

4.  **Configure environment variables:**

    Create `.env` files in the `backend`, `httpServer`, `Price-Websocket` and `frontend` directories based on the `.env.example` or similar files (if present).  Set the following environment variables:

    *   **Backend/httpServer:**
        *   `DATABASE_URL`: PostgreSQL database connection URI.
        *   `REDIS_URL`: Redis connection URI.
        *   `JWT_SECRET`: Secret key for JWT authentication.
        *   `SENDGRID_API_KEY`: API key for SendGrid email service.
        *   `FRONTEND_URL`: The URL for the frontend, in order to allow CORS.
    *   **Price-Websocket:**
        *   No specific env vars.
    *   **Frontend:**
        *   `VITE_BACKEND_URL`: The URL for the backend api.
        *   `VITE_WEBSOCKET_URL`: The URL for the price-websocket server.

5.  **Run the PostgreSQL database:**

    Ensure you have PostgreSQL installed and running. Create a database and configure the `DATABASE_URL` environment variable accordingly.

6.  **Run Redis server:**

    Ensure you have Redis installed and running. Configure the `REDIS_URL` environment variable.

7.  **Run the backend servers:**

    ```bash
    cd backend
    npm run dev # or npm start
    cd ../httpServer
    npm run dev # or npm start
    cd ../Price-Websocket
    npm run dev # or npm start
    ```

8.  **Run the frontend:**

    ```bash
    cd frontend
    npm run dev
    ```

## Usage

1.  **Access the platform:** Open your browser and navigate to the address where the frontend is running (typically `http://localhost:5173`).

2.  **Sign up/Sign in:** Create a new user account or sign in with existing credentials.

3.  **View real-time prices:** The main trading interface displays real-time prices for SOL, BTC, and ETH.

4.  **Place orders:** Use the buy/sell order form to create new orders, specifying margin, leverage, stop loss, and take profit values.

5.  **Manage orders:** View and close open orders in the order management section.

6.  **View candlestick charts:** Analyze historical price data using the candlestick charts with selectable time intervals.

## Environment Variables

*   `DATABASE_URL`: PostgreSQL database connection URI.
*   `REDIS_URL`: Redis connection URI.
*   `JWT_SECRET`: Secret key for JWT authentication.
*   `SENDGRID_API_KEY`: API key for SendGrid email service.
*   `FRONTEND_URL`: The URL for the frontend, in order to allow CORS.
*   `VITE_BACKEND_URL`: The URL for the backend API.
*   `VITE_WEBSOCKET_URL`: The URL for the price-websocket server.

## Project Structure

```
/
├── Readme.md                 # This file
├── backend/                 # Backend server (Node.js/TypeScript)
│   ├── src/                # Backend source code
│   │   ├── index.ts           # Backend entry point
│   ├── package.json         # Backend dependencies and scripts
│   ├── tsconfig.json        # TypeScript configuration
│   └── nodemon.json         # Nodemon configuration
├── httpServer/              # HTTP server for API endpoints (Node.js/TypeScript)
│   ├── src/                # HttpServer source code
│   │   ├── server.ts          # HttpServer entry point
│   │   ├── jwt.ts             # JWT related code
│   │   ├── models/           # Data models
│   │   ├── utils/            # Utility functions
│   │   ├── services/          # Business Logic services
│   ├── package.json         # HttpServer dependencies and scripts
│   ├── tsconfig.json        # TypeScript configuration
├── Price-Websocket/           # Price WebSocket Server
│   ├── src/                # Price WebSocket source code
│   │   ├── server.ts          # Price WebSocket entry point
│   ├── package.json         # Price WebSocket dependencies and scripts
│   ├── tsconfig.json        # TypeScript configuration
├── frontend/                # Frontend application (React)
│   ├── src/                # Frontend source code
│   │   ├── components/       # React components
│   │   ├── assets/           # Static assets (images, etc.)
│   │   ├── App.jsx            # Main App Component
│   │   ├── main.jsx           # React entry point
│   │   ├── index.css          # Global CSS styles
│   │   ├── stores/          # Zustand stores
│   ├── package.json         # Frontend dependencies and scripts
│   ├── vite.config.js       # Vite configuration
│   ├── index.html           # HTML entry point

```

## Technologies Used

<p align="left">
  <a href="#"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="#"><img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"></a>
  <a href="#"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JSON Web Tokens"></a>
  <a href="#"><img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"></a>
  <a href="#"><img src="https://img.shields.io/badge/Vite-B4B4B4?style=for-the-badge&logo=vite&logoColor=646CFF" alt="Vite"></a>
  <a href="#"><img src="https://img.shields.io/badge/Zustand-ffffff?style=for-the-badge&logo=zustand&logoColor=black" alt="Zustand"></a>
</p>

## License

MIT License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
