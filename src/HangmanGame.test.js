// src/__tests__/HangmanGame.test.jsx
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HangmanGame from './HangmanGame';

// Mock the search bar: controlled input + CLEAR after submit
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
        <button
          onClick={() => {
            onSearch(val);
            setVal(''); // <-- important: keep each guess a single letter
          }}
        >
          Guess
        </button>
      </div>
    );
  };
});

const getImage = () => screen.getByAltText(/hangman/i);
const getMissedPara = () => screen.getByText(/Missed Letters:/i).closest('p');

describe('HangmanGame', () => {
 beforeEach(() => {
   // reset any prior calls and re-spy fresh each test
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
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
    const user = userEvent.setup();
    render(<HangmanGame />);
    const img = getImage();

    expect(img.getAttribute('src')).toMatch(/noose\.png$/);

    await user.type(screen.getByLabelText('guess-input'), 'z');
    fireEvent.click(screen.getByText(/guess/i));

    expect(getImage().getAttribute('src')).toMatch(/upperBody\.png$/);
    expect(getMissedPara()).toHaveTextContent(/z/i); // read from the <p>
  });

  test('correct guess does NOT advance image and does NOT add to missed letters', async () => {
    const user = userEvent.setup();
    render(<HangmanGame />);
    const img = getImage();
    const initialSrc = img.getAttribute('src');

    await user.type(screen.getByLabelText('guess-input'), 'e');
    fireEvent.click(screen.getByText(/guess/i));

    expect(getImage().getAttribute('src')).toBe(initialSrc);
    expect(getMissedPara()).toHaveTextContent(/None yet/i);
    // optional: letter shows somewhere in boxes
    expect(screen.getAllByText(/e/i).length).toBeGreaterThan(0);
  });

  test('duplicate wrong guess is ignored (does not double count)', async () => {
    const user = userEvent.setup();
    render(<HangmanGame />);
    const img = getImage();

    await user.type(screen.getByLabelText('guess-input'), 'q');
    fireEvent.click(screen.getByText(/guess/i));
    const afterOne = img.getAttribute('src');

    await user.type(screen.getByLabelText('guess-input'), 'q');
    fireEvent.click(screen.getByText(/guess/i));
    const afterTwo = img.getAttribute('src');

    expect(afterTwo).toBe(afterOne);

    const text = getMissedPara()?.textContent || '';
    expect((text.match(/q/g) || []).length).toBe(1);
  });

  test('non-letter input is ignored', async () => {
    const user = userEvent.setup();
    render(<HangmanGame />);
    const img = getImage();
    const initialSrc = img.getAttribute('src');

    await user.type(screen.getByLabelText('guess-input'), '1');
    fireEvent.click(screen.getByText(/guess/i));

    expect(getImage().getAttribute('src')).toBe(initialSrc);
    expect(getMissedPara()).toHaveTextContent(/None yet/i);
  });

  test('New Game resets state (image and missed letters)', async () => {
    const user = userEvent.setup();
    render(<HangmanGame />);

    await user.type(screen.getByLabelText('guess-input'), 'z');
    fireEvent.click(screen.getByText(/guess/i));
    expect(getImage().getAttribute('src')).toMatch(/upperBody\.png$/);

    fireEvent.click(screen.getByText(/New Game/i));
    expect(getImage().getAttribute('src')).toMatch(/noose\.png$/);
    expect(getMissedPara()).toHaveTextContent(/None yet/i);
  });

  test('win condition triggers alert and resets (guess all unique letters in "Morehouse")', async () => {
   // Use fake timers for this test so we can flush the 10ms setTimeout
  jest.useFakeTimers();
 const user = userEvent.setup({ advanceTimers: (ms) => jest.advanceTimersByTime(ms) });

    render(<HangmanGame />);

    const winningLetters = ['m', 'o', 'r', 'e', 'h', 'u', 's'];
    for (const ch of winningLetters) {
      await user.type(screen.getByLabelText('guess-input'), ch);
      fireEvent.click(screen.getByText(/guess/i));
    }

   // Now the alert runs via the scheduled timeout — fast-forward time
 act(() => {
  jest.advanceTimersByTime(20);
 });
 expect(window.alert).toHaveBeenCalledWith('You win! 🎉');
   jest.useRealTimers();
   // wait for React to commit the reset render
 await waitFor(() =>
   expect(getImage().getAttribute('src')).toMatch(/noose\.png$/)
  );
    expect(getMissedPara()).toHaveTextContent(/None yet/i);
  });

test('game over triggers alert and resets after enough wrong guesses', async () => {
   jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: (ms) => jest.advanceTimersByTime(ms) });
    render(<HangmanGame />);

    const wrongs = ['z', 'q', 'x', 'v', 'b', 'n', 't', 'y'];
    for (const ch of wrongs) {
      await user.type(screen.getByLabelText('guess-input'), ch);
      fireEvent.click(screen.getByText(/guess/i));
      if (getImage().getAttribute('src').match(/botharms\.png$/)) break;
    }
// Fast-forward the 10ms timeout that fires the alert + reset
 act(() => {
   jest.advanceTimersByTime(20);
  });
   expect(window.alert).toHaveBeenCalledWith('Game Over');
jest.useRealTimers();

// wait for React to apply the setState from startNewGame()

await waitFor(() =>
   expect(getImage().getAttribute('src')).toMatch(/noose\.png$/)
  );

 expect(getMissedPara()).toHaveTextContent(/None yet/i);
  });
});
