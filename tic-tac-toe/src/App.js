import React, { useState, useEffect } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import './App.css';

const apiUrl = "http://127.0.0.1:5000"; // Backend URL

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [player, setPlayer] = useState({ username: "", token: null });
  const [confetti, setConfetti] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [moves, setmoves] = useState(0);
  

  useEffect(() => {
    if (winner) {
      updateScore();
    }
  }, [winner]);

  // Handle player move
  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;
    setmoves(prevmoves=>prevmoves+1);
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    checkWinner(newBoard);
    setIsPlayerTurn(false);
  };

  // Computer move
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const emptyIndices = board.reduce((acc, val, idx) => (val === null ? acc.concat(idx) : acc), []);
      const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      if (randomMove !== undefined) {
        const newBoard = [...board];
        newBoard[randomMove] = "O";
        setTimeout(() => {
          setBoard(newBoard);
          checkWinner(newBoard);
          setIsPlayerTurn(true);
        }, 500);
      }
    }
  }, [isPlayerTurn]);

  // Check for winner
  const checkWinner = (newBoard) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        setWinner(newBoard[a] === "X" ? player.username : "Computer");
        return;
      }
    }
    if (!newBoard.includes(null)) {
      setWinner("Draw");
    }
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    setConfetti(false);
    setmoves(0);
  };

  // Calculate score using formula 100 - (10 * number of moves)
const calculateScore = (board) => {
  
  return 100 - (10 * moves);
};

// Update score when the player wins
const updateScore = async () => {
  if (winner === player.username) {
    const newScore = calculateScore(board); // Use the formula to calculate score

    try {
      await axios.post(
        `${apiUrl}/update-score`,
        { score: newScore },
        { headers: { Authorization: `Bearer ${player.token}` } }
      );
      setPlayerScore(newScore);
      alert("You won");

      if (newScore > highScore) {
        setHighScore(newScore);
        setConfetti(true); // Confetti if new high score
      }
    } catch (error) {
      console.error("Error updating score", error);
    }
  }
  else{
    alert("You lost");

  }
};


  // Register player
  const registerPlayer = async (username, password, email) => {
    try {
      await axios.post(`${apiUrl}/register`, { username, password, email });
      loginPlayer(username, password);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  // Login player
  const loginPlayer = async (username, password) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, { username, password });
      const token = response.data.token;
      setPlayer({ username, token });
      setIsLoggedIn(true);
      fetchScores(token);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Fetch player score from backend
  const fetchScores = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/scores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayerScore(response.data.currentScore);
      setHighScore(response.data.highScore);
    } catch (error) {
      console.error("Error fetching scores", error);
    }
  };

  return (
    <div className="App">
      {confetti && <Confetti />}
      {!isLoggedIn ? (
        <div>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setPlayer({ ...player, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPlayer({ ...player, password: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setPlayer({ ...player, email: e.target.value })}
          />
          <button onClick={() => registerPlayer(player.username, player.password, player.email)}>
            Sign Up
          </button>

          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setPlayer({ ...player, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPlayer({ ...player, password: e.target.value })}
          />
          <button onClick={() => loginPlayer(player.username, player.password)}>Login</button>
        </div>
      ) : (
        <div>
          <h1>Tic-Tac-Toe</h1>
          <div className="board">
            {board.map((cell, index) => (
              <div key={index} className="cell" onClick={() => handleClick(index)}>
                {cell}
              </div>
            ))}
          </div>
          <div>
            <p>{winner ? `Winner: ${winner}` : `Your Turn`}</p>
            <p>Score: {playerScore} | High Score: {highScore}</p>
          </div>
          {winner && <button onClick={resetGame}>Play Again</button>}
        </div>
      )}
    </div>
  );
}

export default App;
