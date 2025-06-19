// client/src/__tests__/PostJob.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import PostJob from '@/pages/post-job'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
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

// Mock fetch for API calls
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

beforeEach(() => {
  mockFetch.mockClear()
})

test('renders post job form with all required fields', () => {
  render(<PostJob />, { wrapper: TestProviders })
  
  // Check for form elements
  expect(screen.getByLabelText(/Job Heading/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Number of Children/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Hourly Rate/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Hours per Week/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Job Description/i)).toBeInTheDocument()
})

test('shows validation error for empty required fields', async () => {
  const user = userEvent.setup()
  render(<PostJob />, { wrapper: TestProviders })
  
  const submitButton = screen.getByRole('button', { name: /create job/i })
  await user.click(submitButton)
  
  await waitFor(() => {
    expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument()
  })
})

test('successfully submits job posting form', async () => {
  const user = userEvent.setup()
  
  // Mock successful API response
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: 'Job posted successfully!' }),
  } as Response)
  
  render(<PostJob />, { wrapper: TestProviders })
  
  // Fill out the form
  await user.type(screen.getByLabelText(/Job Heading/i), 'After School Nanny Needed')
  await user.type(screen.getByLabelText(/Start Date/i), '2025-07-01')
  await user.clear(screen.getByLabelText(/Number of Children/i))
  await user.type(screen.getByLabelText(/Number of Children/i), '2')
  await user.type(screen.getByLabelText(/Hourly Rate/i), '30')
  await user.type(screen.getByLabelText(/Hours per Week/i), '15')
  await user.type(screen.getByLabelText(/Job Description/i), 'Looking for a reliable nanny for after school care.')
  
  // Select position type
  const positionSelect = screen.getByRole('combobox', { name: /position type/i })
  await user.click(positionSelect)
  await user.click(screen.getByText(/Part-time/i))
  
  // Select availability
  const availabilitySelect = screen.getByRole('combobox', { name: /availability needed/i })
  await user.click(availabilitySelect)
  await user.click(screen.getByText(/Weekdays/i))
  
  // Submit the form
  const submitButton = screen.getByRole('button', { name: /create job/i })
  await user.click(submitButton)
  
  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith('/api/postJob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'After School Nanny Needed',
        startDate: '2025-07-01',
        numChildren: 2,
        rate: '30',
        hoursPerWeek: '15',
        positionType: 'Part-time',
        availabilityNeeded: 'Weekdays',
        description: 'Looking for a reliable nanny for after school care.'
      })
    })
  })
})