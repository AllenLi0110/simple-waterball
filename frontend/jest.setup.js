// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Create a shared mock push function that can be accessed in tests
const mockPush = jest.fn();

// Mock Next.js navigation for tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Export mockPush so tests can access it
global.mockRouterPush = mockPush;
