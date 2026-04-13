import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the deployment heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /react docker pipeline/i })).toBeInTheDocument();
    expect(screen.getByText(/served by nginx on port 8080/i)).toBeInTheDocument();
  });
});

