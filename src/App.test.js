// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Welcome to Hangman header', () => {
  render(<App />);
  expect(screen.getByText(/Welcome to Hangman!/i)).toBeInTheDocument();
});
