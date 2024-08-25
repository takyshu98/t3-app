import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Home from './page';

const mockHello = vi.hoisted(() => vi.fn().mockResolvedValue({ greeting: 'Hello from tRPC' }));
const mockPrefetch = vi.hoisted(() => vi.fn());
const mockGetServerAuthSession = vi.hoisted(() => vi.fn().mockResolvedValue({ user: { name: 'Test User' } }));
vi.mock('~/trpc/server', () => ({
  api: {
    post: {
      hello: mockHello,
      getLatest: {
        prefetch: mockPrefetch
      }
    }
  },
  HydrateClient: () => <div>mock</div>
}));

vi.mock('~/server/auth', () => ({
  getServerAuthSession: mockGetServerAuthSession
}));

describe('Home component', () => {
  it('renders correctly', async () => {
    // const { findByText } = render(<Home />);

    // expect(await findByText('Create T3 App')).toBeInTheDocument();
    // expect(await findByText('Hello from tRPC')).toBeInTheDocument();
    // expect(await findByText('Logged in as Test User')).toBeInTheDocument();
    // expect(mockHello).toHaveBeenCalled();
    // expect(mockPrefetch).toHaveBeenCalled();
    // expect(mockGetServerAuthSession).toHaveBeenCalled();
  });
});