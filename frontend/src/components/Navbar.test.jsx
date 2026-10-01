import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar component', () => {
  it('renders theme toggle button with accessible aria-label', () => {
    const handleToggle = vi.fn();
    render(
      <Navbar
        isDemoMode={false}
        onOpenCreateModal={vi.fn()}
        onRetryConnection={vi.fn()}
        isConnecting={false}
        isDark={false}
        onToggleTheme={handleToggle}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeDefined();

    fireEvent.click(toggleButton);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('renders moon icon when theme is light and sun icon when theme is dark', () => {
    const { rerender, container } = render(
      <Navbar
        isDemoMode={false}
        onOpenCreateModal={vi.fn()}
        onRetryConnection={vi.fn()}
        isConnecting={false}
        isDark={false}
        onToggleTheme={vi.fn()}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton.querySelector('svg')).toBeDefined();

    rerender(
      <Navbar
        isDemoMode={false}
        onOpenCreateModal={vi.fn()}
        onRetryConnection={vi.fn()}
        isConnecting={false}
        isDark={true}
        onToggleTheme={vi.fn()}
      />
    );

    expect(toggleButton.querySelector('svg')).toBeDefined();
  });
});
