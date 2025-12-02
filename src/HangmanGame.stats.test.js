// src/HangmanGame_stats.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import HangmanGame from './HangmanGame';

describe('HangmanGame header UI', () => {
  test('shows the player name in the header', () => {
    render(<HangmanGame playerName="aydan" />);

    // "Player:" label exists
    expect(screen.getByText(/Player:/i)).toBeInTheDocument();
    // player name text exists somewhere
    expect(screen.getByText(/aydan/i)).toBeInTheDocument();
  });

  test('shows wins, losses, and win percentage stats', () => {
    render(<HangmanGame playerName="aydan" />);

    // Initial text: "Wins: 0 | Losses: 0 | Win %: 0.0%"
    expect(
      screen.getByText(/Wins:\s*0\s*\|\s*Losses:\s*0\s*\|\s*Win %:\s*0\.0%/i)
    ).toBeInTheDocument();
  });
});
