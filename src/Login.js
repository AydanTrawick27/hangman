// src/Login.js
import React, { useState } from "react";

function Login({ setIsLoggedIn, setPlayerName }) {
  const [value, setValue] = useState("");

  const logout = () => {
    console.log("logging out");
    setIsLoggedIn(false);
  };

  const login = async () => {
    const lowered = value.toLowerCase();
    const url = `http://localhost:3001/api/player?playerName=${lowered}`;

    // 1) see if the player already exists
    let res = await fetch(url);
    if (res.status === 200) {
      setPlayerName(lowered);
      setIsLoggedIn(true);
      return;
    }

    // 2) if not, create them
    const postURL = "http://localhost:3001/api/players";
    const postData = { playerName: lowered };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    };

    console.log(requestOptions);
    res = await fetch(postURL, requestOptions);
    if (res.status === 200) {
      setPlayerName(lowered);
      setIsLoggedIn(true);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter player name"
      />
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Login;
