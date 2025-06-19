// client/src/__tests__/Home.test.tsx
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import Home from '@/pages/home'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

function TestProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vivaly-ui-theme">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

// Mock the fetch function to prevent actual API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock

test('renders hero section on home page', async () => {
  render(<Home />, { wrapper: TestProviders })
  
  // Check for main hero text
  expect(screen.getByText(/Connect with trusted caregivers/i)).toBeInTheDocument()
})

test('renders service categories', async () => {
  render(<Home />, { wrapper: TestProviders })
  
  // Check for service category sections
  expect(screen.getByText(/Child Care/i)).toBeInTheDocument()
  expect(screen.getByText(/Pet Care/i)).toBeInTheDocument()
})

test('renders search functionality', async () => {
  render(<Home />, { wrapper: TestProviders })
  
  // Check for search elements
  expect(screen.getByPlaceholderText(/Where do you need care/i)).toBeInTheDocument()
})