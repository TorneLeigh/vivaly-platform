// Simple test to verify API connection works
// Run this in your browser console on the deployed site

async function testApiConnection() {
  console.log('Testing API connection...');
  
  // Test 1: Check if API base URL is correctly configured
  const apiUrl = import.meta?.env?.VITE_API_URL || '';
  console.log('API Base URL:', apiUrl || 'Using relative URLs');
  
  // Test 2: Test health endpoint
  try {
    const healthResponse = await fetch('/api/health', {
      credentials: 'include'
    });
    console.log('Health check:', healthResponse.status, healthResponse.statusText);
  } catch (error) {
    console.error('Health check failed:', error);
  }
  
  // Test 3: Test login endpoint (should fail with 400 for missing credentials)
  try {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      credentials: 'include'
    });
    console.log('Login endpoint test:', loginResponse.status, loginResponse.statusText);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
  } catch (error) {
    console.error('Login endpoint test failed:', error);
  }
}

// Run the test
testApiConnection();