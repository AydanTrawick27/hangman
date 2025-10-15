<<<<<<< HEAD
import './App.css';
import React from 'react';
import LetterBox from './LetterBox';
import SingleLetterSearchbar from './SingleLetterSearchBar';

const pics = ['noose.png', 'upperBody.png', 'upperandlower.png', '1arm.png', 'botharms.png'];
const words = ["Morehouse", "Spelman", "Basketball", "Table", "Museum", "Excellent", "Fun", "React"];
class HangmanGame extends React.Component {
  state = {
    wordList: [],
    curWord:  0,
    lifeLeft: 0,
    usedLetters: []
  }
  componentDidMount() {
    
    console.log(words);
    this.setState({
      wordList: words
    });
  }
  getPlayerName = (name) => {
    this.setState({
      playerName: name
    });
  }
  startNewGame = () => {
    this.setState({
      curWord: Math.floor(Math.random() * this.state.wordList.length)
    });
  }

  render(){
    const word = this.state.wordList[this.state.curWord];
    return(
      <div>
        <img src={pics[this.state.lifeLeft]}/>
        <button onClick={this.startNewGame}>New Game</button>
        <p>{word}</p>
        <SingleLetterSearchbar></SingleLetterSearchbar>

        <LetterBox 
          letter="a"
          isVisible={true}
          boxStyle={{ backgroundColor: 'lightblue' }}
          letterStyle={{ color: 'white', fontSize: '30px' }}
        ></LetterBox>
      </div>
    )
  }

}



export default HangmanGame;
=======
import "./App.css";
import React from "react";
import LetterBox from "./LetterBox";
import SingleLetterSearchbar from "./SingleLetterSearchBar";

const pics = ["noose.png", "upperBody.png", "upperandlower.png", "1arm.png", "botharms.png"];
const words = ["Morehouse", "Spelman", "Basketball", "Table", "Museum", "Excellent", "Fun", "React"];

class HangmanGame extends React.Component {
  state = {
    wordList: words,
    curWordIndex: 0,      // points at the current word in the array
    wrongCount: 0,        // how many incorrect guesses (which picture to show)
    guessed: new Set(),   // correctly-guessed letters (lowercase)
    missed: [],           // wrong letters in the order guessed
  };

  // Go to the next word (wrapping around), reset counters.
  startNewGame = () => {
    this.setState((prev) => ({
      curWordIndex: (prev.curWordIndex + 1) % prev.wordList.length,
      wrongCount: 0,
      guessed: new Set(),
      missed: [],
    }));
  };

  // Normalize and handle a single-letter guess
  handleGuess = (rawLetter) => {
    if (!rawLetter) return;
    const letter = rawLetter.toLowerCase().trim();
    if (!/^[a-z]$/.test(letter)) return; // ignore non-letters / multi-letters

    const { wordList, curWordIndex, guessed, missed, wrongCount } = this.state;
    const word = wordList[curWordIndex].toLowerCase();

    // already used?
    if (guessed.has(letter) || missed.includes(letter)) return;

    if (word.includes(letter)) {
      // correct guess
      const newGuessed = new Set(guessed);
      newGuessed.add(letter);

      this.setState({ guessed: newGuessed }, () => {
        // win check: have we guessed every alphabetic letter in the word?
        const lettersOnly = new Set([...word].filter((c) => /[a-z]/.test(c)));
        const allFound = [...lettersOnly].every((c) => this.state.guessed.has(c));
        if (allFound) {
          setTimeout(() => {
            alert("You win! 🎉");
            this.startNewGame();
          }, 10);
        }
      });
    } else {
      // wrong guess
      const nextWrong = wrongCount + 1;
      const newMissed = [...missed, letter];

      if (nextWrong >= pics.length - 1) {
        // we are about to show the last image -> game over
        this.setState({ wrongCount: nextWrong, missed: newMissed }, () => {
          setTimeout(() => {
            alert("Game Over 😵");
            this.startNewGame();
          }, 10);
        });
      } else {
        this.setState({ wrongCount: nextWrong, missed: newMissed });
      }
    }
  };

  renderWordBoxes(word, guessedSet) {
    // Render one LetterBox per character. Show the letter only if it's been guessed.
    return (
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {[...word].map((ch, i) => {
          const isLetter = /[a-z]/i.test(ch);
          const visible = isLetter && guessedSet.has(ch.toLowerCase());
          // spaces get a thin spacer instead of a box
          if (!isLetter && ch === " ") {
            return <div key={i} style={{ width: 14 }} />;
          }
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
  const { wordList, curWordIndex, guessed, missed, wrongCount } = this.state;
  const word = wordList[curWordIndex] ?? "";

  return (
    <div>
      <img src={"/" + pics[wrongCount]} alt="hangman" />
      <button onClick={this.startNewGame}>New Game</button>

      {/* ✅ Correct place & prop name */}
      <SingleLetterSearchbar onSearch={this.handleGuess} />

      {this.renderWordBoxes(word, guessed)}
      <p>
        <strong>Missed Letters:</strong> {missed.length ? missed.join(", ") : "None yet"}
      </p>
    </div>
  );
}

}

export default HangmanGame;

>>>>>>> 537a4f1c (Initial commit: Hangman game)
