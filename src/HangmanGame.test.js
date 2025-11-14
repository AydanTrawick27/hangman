import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HangmanGame from './HangmanGame'; 



jest.mock('./SingleLetterSearchBar', () => {
  const React = require('react'); 
  return function MockSearchbar({ onSearch }) {
    const [val, setVal] = React.useState('');
    return (
      <div>
        <input
          aria-label="guess-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button onClick={() => onSearch(val)}>Guess</button>
      </div>
    );
  };
});


const getImage = () => screen.getByAltText(/hangman/i);

describe('HangmanGame', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    window.alert.mockRestore();
  });

  test('renders starting state (image + no missed letters)', () => {
    render(<HangmanGame />);
    expect(getImage()).toBeInTheDocument();
    expect(screen.getByText(/Missed Letters:/i)).toBeInTheDocument();
    expect(screen.getByText(/None yet/i)).toBeInTheDocument();
    
    expect(getImage().getAttribute('src')).toMatch(/\/?noose\.png$/);
  });

  test('wrong guess increments wrongCount, updates image, and shows missed letter', async () => {
    render(<HangmanGame />);
    const img = getImage();

    // initial image
    expect(img.getAttribute('src')).toMatch(/noose\.png$/);

    // enter a wrong letter 
    await userEvent.type(screen.getByLabelText('guess-input'), 'z');
    fireEvent.click(screen.getByText(/guess/i));

  
    expect(getImage().getAttribute('src')).toMatch(/upperBody\.png$/);
    expect(screen.getByText(/Missed Letters:/i).nextSibling.textContent).toMatch(/z/i);
  });

  test('correct guess does NOT advance image and does NOT add to missed letters', async () => {
    render(<HangmanGame />);
    const img = getImage();
    const initialSrc = img.getAttribute('src');

   
    await userEvent.type(screen.getByLabelText('guess-input'), 'e');
    fireEvent.click(screen.getByText(/guess/i));

    expect(getImage().getAttribute('src')).toBe(initialSrc);
    expect(screen.queryByText(/z/i)).not.toBeInTheDocument(); 

    expect(screen.getAllByText(/e/i).length).toBeGreaterThan(0);
  });

  test('duplicate wrong guess is ignored (does not double count)', async () => {
    render(<HangmanGame />);
    const img = getImage();

    await userEvent.type(screen.getByLabelText('guess-input'), 'q');
    fireEvent.click(screen.getByText(/guess/i));
    const afterOne = img.getAttribute('src');

    // same wrong guess again
    await userEvent.type(screen.getByLabelText('guess-input'), 'q');
    fireEvent.click(screen.getByText(/guess/i));
    const afterTwo = img.getAttribute('src');

  
    expect(afterTwo).toBe(afterOne);

  
    const missedText = screen.getByText(/Missed Letters:/i).nextSibling.textContent;
    expect(missedText.match(/q/g).length).toBe(1);
  });

  test('non-letter input is ignored', async () => {
    render(<HangmanGame />);
    const img = getImage();
    const initialSrc = img.getAttribute('src');

    await userEvent.type(screen.getByLabelText('guess-input'), '1');
    fireEvent.click(screen.getByText(/guess/i));

    expect(getImage().getAttribute('src')).toBe(initialSrc);
    expect(screen.getByText(/None yet/i)).toBeInTheDocument();
  });

  test('New Game resets state (image and missed letters)', async () => {
    render(<HangmanGame />);
   
    await userEvent.type(screen.getByLabelText('guess-input'), 'z');
    fireEvent.click(screen.getByText(/guess/i));
    expect(getImage().getAttribute('src')).toMatch(/upperBody\.png$/);

    // reset
    fireEvent.click(screen.getByText(/New Game/i));
    expect(getImage().getAttribute('src')).toMatch(/noose\.png$/);
    expect(screen.getByText(/None yet/i)).toBeInTheDocument();
  });

  test('win condition triggers alert and resets (guess all unique letters in "Morehouse")', async () => {
    render(<HangmanGame />);

   
    const winningLetters = ['m', 'o', 'r', 'e', 'h', 'u', 's'];
    for (const ch of winningLetters) {
      await userEvent.type(screen.getByLabelText('guess-input'), ch);
      fireEvent.click(screen.getByText(/guess/i));
    }

   
    expect(window.alert).toHaveBeenCalledWith('You win! 🎉');

   
    jest.advanceTimersByTime(20);

    expect(getImage().getAttribute('src')).toMatch(/noose\.png$/);
    expect(screen.getByText(/None yet/i)).toBeInTheDocument();
  });

  test('game over triggers alert and resets after enough wrong guesses', async () => {
    render(<HangmanGame />);

   
    const wrongs = ['z', 'q', 'x', 'v', 'b', 'n', 't', 'y']; 
    for (const ch of wrongs) {
      await userEvent.type(screen.getByLabelText('guess-input'), ch);
      fireEvent.click(screen.getByText(/guess/i));
     
      if (getImage().getAttribute('src').match(/botharms\.png$/)) break;
    }

    expect(window.alert).toHaveBeenCalledWith('Game Over');
    jest.advanceTimersByTime(20);

    expect(getImage().getAttribute('src')).toMatch(/noose\.png$/);
    expect(screen.getByText(/None yet/i)).toBeInTheDocument();
  });
});
