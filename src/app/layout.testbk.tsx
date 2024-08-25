import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import RootLayout from './layout';

describe('RootLayout Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('includes TRPCReactProvider', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>
    );
    expect(container.firstChild).toHaveClass('TRPCReactProvider');
  });
});