import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

// Composant de test qui lance une erreur
function ThrowError({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Contenu normal</div>;
}

describe('ErrorBoundary', () => {
  it('affiche les enfants quand il n\'y a pas d\'erreur', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Contenu normal')).toBeInTheDocument();
  });

  it('affiche l\'UI de fallback quand une erreur est lancée', () => {
    // Supprimer les erreurs console pour ce test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/une erreur est survenue/i)).toBeInTheDocument();
    expect(screen.getByText(/réessayer/i)).toBeInTheDocument();
    
    consoleError.mockRestore();
  });

  it('réinitialise l\'erreur quand on clique sur Réessayer', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/une erreur est survenue/i)).toBeInTheDocument();
    
    const resetButton = screen.getByText(/réessayer/i);
    fireEvent.click(resetButton);
    
    // Après reset, re-render sans erreur
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Contenu normal')).toBeInTheDocument();
    
    consoleError.mockRestore();
  });
});
