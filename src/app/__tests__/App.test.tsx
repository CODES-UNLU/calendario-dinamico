import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('App (Etapa 0)', () => {
  it('renderiza el título institucional y el logo de CODES', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /CODES Studio/i })).toBeInTheDocument();
    expect(screen.getByAltText('Logo CODES')).toBeInTheDocument();
  });
});
