# <p align="center">Trading Platform</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="#"><img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/WebSocket-000000?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSocket"></a>
  <a href="#"><img src="https://img.shields.io/badge/Zustand-804CD9?style=for-the-badge&logoColor=white" alt="Zustand"></a>
</p>

## Introduction

This project is a modern trading platform built with React and FastAPI, providing real-time market data, order management, and user authentication. It allows users to monitor assets, view candlestick charts, and execute buy/sell orders. The platform uses WebSockets for real-time updates and JWT for secure authentication.

## Table of Contents

1.  [Key Features](#key-features)
2.  [Installation Guide](#installation-guide)
3.  [Usage](#usage)
4.  [Environment Variables](#environment-variables)
5.  [Project Structure](#project-structure)
6.  [Technologies Used](#technologies-used)
7.  [License](#license)

## Key Features

-   **Real-time Market Data:** Leverages WebSockets for live updates of bid/ask prices and trade data.
-   **Interactive Candlestick Charts:** Uses TradingView Lightweight Charts to display historical and real-time price movements.
-   **Order Management:** Allows users to open and close orders with margin and leverage.
-   **User Authentication:** Implements secure authentication using JWT (JSON Web Tokens).
-   **Account Balance:** Displays the user's account balance.
-   **Profit/Loss (PNL) Calculation:** Calculates and displays the PNL for open orders.
-   **Asset Selection:** Provides a mechanism for selecting different trading assets.
-   **Responsive UI:** Built with React for a dynamic and responsive user experience.

## Installation Guide

Follow these steps to set up the project:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install # or yarn install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install # or yarn install
    ```

4.  **Configure environment variables:**

    -   Create a `.env` file in both the `backend` and `frontend` directories.
    -   Add the necessary environment variables (see [Environment Variables](#environment-variables) section).

5.  **Run the backend server:**

    ```bash
    cd ../backend
    npm run dev # or yarn dev (if nodemon is configured)
    ```

6.  **Run the frontend development server:**

    ```bash
    cd ../frontend
    npm run dev # or yarn dev
    ```

## Usage

### Frontend

-   The frontend is a React application accessible through a web browser.
-   It connects to the backend API to fetch data, manage orders, and authenticate users.
-   Users can sign in using the `Signin` component.
-   The `Home` component displays the trading interface.
-   Use the `buyAndSell` Component to create orders.
-   Use `candleChart` to view historical and real-time price charts.

### Backend

-   The backend is a FastAPI server that provides API endpoints for:
    -   User authentication (`/api/v1/user/signin`).
    -   Fetching candle data (`/candles`).
    -   Opening orders (`/order/open`).
    -   Closing orders (`/order/close`).
    -   Fetching open orders (`/orders`).
-   It uses WebSockets to push real-time market data to the frontend.

## Environment Variables

**Backend (.env):**

-   `JWT_SECRET_KEY`: Secret key used to sign JWT tokens.
-   `DATABASE_URL`: Connection string to the database.
-   `WS_PORT`: Port for the WebSocket server

**Frontend (.env):**

-   `VITE_API_BASE_URL`: Base URL of the backend API (e.g., `http://localhost:3000`).
-   `VITE_WS_URL`: URL for the WebSocket server (e.g., `ws://localhost:8080`).

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── jwt.ts
│   │   ├── bidAsk.ts
│   │   ├── index.ts
│   │   ├── dataBook.ts
│   │   ├── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── buyAndSell.jsx
│   │   │   ├── askBid.jsx
│   │   │   ├── candleChart.jsx
│   │   │   ├── signin.jsx
│   │   │   ├── logos.js
│   │   │   ├── makeOrder.jsx
│   │   ├── stores/
│   │   │   └── useSelectedAsset.js
│   │   ├── utils/
│   │   │   └── wsstore.js
│   │   ├── assets/
│   │   │   ├── exness_logo.png
│   │   │   ├── react.svg
│   │   │   ├── btclogo.png
│   │   │   ├── Solana_logo.png
│   │   │   └── ethereum-eth-logo.png
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── home.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## Technologies Used

<p align="left">
    <a href="#"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
    <a href="#"><img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI"></a>
    <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
    <a href="#"><img src="https://img.shields.io/badge/WebSocket-000000?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSocket"></a>
    <a href="#"><img src="https://img.shields.io/badge/Zustand-804CD9?style=for-the-badge&logoColor=white" alt="Zustand"></a>
    <a href="#"><img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"></a>
    <a href="#"><img src="https://img.shields.io/badge/TradingView-2296FF?style=for-the-badge&logo=tradingview&logoColor=white" alt="TradingView Lightweight Charts"></a>
</p>

-   **Backend:** FastAPI (Python), TypeScript
-   **Frontend:** React, JavaScript
-   **State Management:** Zustand
-   **Charting:** TradingView Lightweight Charts
-   **HTTP Client:** Axios
-   **Real-time Communication:** WebSockets
-   **Authentication:** JWT (JSON Web Tokens)

## License

MIT License

<p align="left">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>