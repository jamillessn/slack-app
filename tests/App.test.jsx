import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

describe('App', () => {
  it('renders headline', () => {
    render(<MemoryRouter><App title="ChatApp" /></MemoryRouter>);
  });
});
