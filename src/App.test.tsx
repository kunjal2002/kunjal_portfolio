import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const heading = screen.getByText(/Software Engineer and Data Enthusiast/i);
  expect(heading).toBeInTheDocument();
});
