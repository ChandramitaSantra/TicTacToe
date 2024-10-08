# Tic-Tac-Toe Game with User Authentication

## Overview
This is a simple Tic-Tac-Toe game built with React on the frontend and Node.js with Express on the backend. The application features user registration and login functionality, game score tracking based on the number of moves, and high score management. Players play against the computer, and scores are updated in real-time based on their performance.

## Features
- **User Registration and Login**: Users can sign up with an email, username, and password, and log in to play the game.
- **Single Player Mode**: Play Tic-Tac-Toe against the computer.
- **Score Tracking**: Scores are calculated based on the number of moves required to win. Fewer moves result in a higher score.
- **High Score Management**: Track and display the user's highest score. Confetti animation celebrates breaking the high score.
- **Real-time Updates**: Scores are updated in real-time based on game outcomes.

## Setup Instructions

### Prerequisites
- Node.js (version 14 or later)
- MongoDB (local or remote instance)

### Frontend Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ChandramitaSantra/TicTacToe.git
   cd TicTacToe
   
# Tic-Tac-Toe Game

## Frontend Setup

1. **Navigate to the Frontend Directory:**

    ```bash
    cd TicTacToe/frontend
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Start the Frontend Server:**

    ```bash
    npm start
    ```

   The React application will run on [http://localhost:3000](http://localhost:3000).

## Backend Setup

1. **Navigate to the Backend Directory:**

    ```bash
    cd TicTacToe/backend
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

   (Additional steps for backend setup, such as starting the server or configuring environment variables, can be added here if needed.)

## Usage

1. Visit [http://localhost:3000](http://localhost:3000) to access the game.
2. Register or log in to start playing against the computer.
3. The score will be updated in real-time, and high scores will be tracked.
