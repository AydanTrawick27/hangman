
import React from 'react';
import { render, screen } from '@testing-library/react';
import LetterBox from './LetterBox';

describe('LetterBox', () => {
  test('shows the letter when isVisible=true', () => {
    render(
      <LetterBox
        letter="A"
        isVisible={true}
        boxStyle={{ width: 40, height: 40 }}
        letterStyle={{ fontSize: 20 }}
      />
    );
    
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  test('hides the letter when isVisible=false', () => {
   render(<LetterBox letter="B" isVisible={false} />);
 const el = screen.getByText('B');
 expect(el).toBeInTheDocument();
 expect(el).not.toBeVisible();  
  });

  test('applies boxStyle and letterStyle (smoke check)', () => {
    const { container } = render(
      <LetterBox
        letter="C"
        isVisible={true}
        boxStyle={{ border: '2px solid rgb(0, 0, 0)' }}
        letterStyle={{ fontWeight: 700 }}
      />
    );

    expect(container.firstChild).toHaveStyle('border: 2px solid rgb(0, 0, 0)');
    expect(screen.getByText('C')).toHaveStyle('font-weight: 700');
  });
});
