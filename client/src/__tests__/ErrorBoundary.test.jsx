import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

const ThrowError = () => {
  throw new Error("Test Error");
};

describe('ErrorBoundary', () => {
  it('renders fallback UI when child throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong while loading this section.')).toBeInTheDocument();
    
    consoleError.mockRestore();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Normal Content')).toBeInTheDocument();
  });
});
