// src/App.js
import React, { useState } from "react";
import "./App.css";
import HangmanGame from "./HangmanGame";
import Login from "./Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPlayerName("");
  };

  return (
    <div className="App">
      <h1>Welcome to Hangman!</h1>

      {!isLoggedIn ? (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          setPlayerName={setPlayerName}
        />
      ) : (
       <HangmanGame playerName={playerName} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
