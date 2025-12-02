import "./App.css";
import React from "react";
import LetterBox from "./LetterBox";
import SingleLetterSearchbar from "./SingleLetterSearchBar";

const pics = [
  "noose.png",
  "upperBody.png",
  "upperandlower.png",
  "1arm.png",
  "botharms.png",
];
const words = [
  "Morehouse",
  "Spelman",
  "Basketball",
  "Table",
  "Museum",
  "Excellent",
  "Fun",
  "React",
];

class HangmanGame extends React.Component {
  state = {
    wordList: words,
    curWordIndex: 0,
    wrongCount: 0,
    guessed: new Set(),
    missed: [],
    wins: 0,
    losses: 0,
  };

  startNewGame = () => {
    this.setState((prev) => ({
      curWordIndex: (prev.curWordIndex + 1) % prev.wordList.length,
      wrongCount: 0,
      guessed: new Set(),
      missed: [],
    }));
  };

  // 📊 PUT stats to API
  updatePlayerStats = async (wins, losses) => {
    const { playerName } = this.props; // passed in from App/Login
    if (!playerName) return;

    try {
      await fetch("http://localhost:3001/player", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName,
          wins,
          losses,
        }),
      });
    } catch (err) {
      console.error("Failed to update stats", err);
    }
  };

  handleWin = () => {
    const wins = this.state.wins + 1;
    this.setState({ wins }, () => {
      this.updatePlayerStats(wins, this.state.losses);
    });
  };

  handleLoss = () => {
    const losses = this.state.losses + 1;
    this.setState({ losses }, () => {
      this.updatePlayerStats(this.state.wins, losses);
    });
  };

  handleGuess = (rawLetter) => {
    if (!rawLetter) return;
    const letter = rawLetter.toLowerCase().trim();
    if (!/^[a-z]$/.test(letter)) return;

    const { wordList, curWordIndex, guessed, missed, wrongCount } = this.state;
    const word = wordList[curWordIndex].toLowerCase();

    if (guessed.has(letter) || missed.includes(letter)) return;

    if (word.includes(letter)) {
      const newGuessed = new Set(guessed);
      newGuessed.add(letter);

      this.setState({ guessed: newGuessed }, () => {
        const lettersOnly = new Set(
          [...word].filter((c) => /[a-z]/.test(c))
        );
        const allFound = [...lettersOnly].every((c) =>
          this.state.guessed.has(c)
        );
        if (allFound) {
          setTimeout(() => {
            alert("You win! 🎉");
            this.handleWin();
            this.startNewGame();
          }, 10);
        }
      });
    } else {
      const nextWrong = wrongCount + 1;
      const newMissed = [...missed, letter];

      if (nextWrong >= pics.length - 1) {
        this.setState({ wrongCount: nextWrong, missed: newMissed }, () => {
          setTimeout(() => {
            alert("Game Over");
            this.handleLoss();
            this.startNewGame();
          }, 10);
        });
      } else {
        this.setState({ wrongCount: nextWrong, missed: newMissed });
      }
    }
  };

  renderWordBoxes(word, guessedSet) {
    return (
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {[...word].map((ch, i) => {
          const isLetter = /[a-z]/i.test(ch);
          const visible = isLetter && guessedSet.has(ch.toLowerCase());
          if (!isLetter && ch === " ") return <div key={i} style={{ width: 14 }} />;

          return (
            <LetterBox
              key={i}
              letter={visible ? ch : ""}
              isVisible={visible}
              boxStyle={{
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#b8d7e8",
                borderRadius: 6,
                border: "2px solid #8fb8cf",
              }}
              letterStyle={{ color: "#fff", fontSize: 24, fontWeight: 700 }}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { playerName, onLogout } = this.props; // from App/Login
    const {
      wordList,
      curWordIndex,
      guessed,
      missed,
      wrongCount,
      wins,
      losses,
    } = this.state;

    const word = wordList[curWordIndex] ?? "";
    const imgSrc = `${process.env.PUBLIC_URL}/${
      pics[Math.min(wrongCount, pics.length - 1)]
    }`;

    const totalGames = wins + losses; 
    const winPct =
      totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0.0";

    return (
  <div>
    {/* Player header / stats */}
    <div style={{ marginBottom: "1rem" }}>
      <p>
        Player: <strong>{playerName}</strong>
      </p>
      <p>
        Wins: {wins} | Losses: {losses} | Win %: {winPct}%
      </p>
      <button onClick={onLogout}>Logout</button>
    </div>

    <img src={imgSrc} alt="hangman" />
    <button onClick={this.startNewGame}>New Game</button>

    <SingleLetterSearchbar onSearch={this.handleGuess} />
    {this.renderWordBoxes(word, guessed)}
    <p>
      <strong>Missed Letters:</strong>{" "}
      {missed.length ? missed.join(", ") : "None yet"}
    </p>
  </div>
);

  }
}

export default HangmanGame;
