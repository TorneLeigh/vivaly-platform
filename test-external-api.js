// Test external API connection from browser console
// Copy and paste this into Chrome DevTools Console on vivaly.com.au

console.log('Testing VIVALY Backend API Connection...');

// Test the backend URL directly
const BACKEND_URL = 'https://db0de57c-0227-4a6d-a48b-bd0f45c473a6-00-srrgnf845gfb.riker.replit.dev';

// Test login endpoint
fetch(`${BACKEND_URL}/api/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'tornevelk1@gmail.com',
    password: 'password123',
    role: 'parent'
  })
})
.then(response => {
  console.log('Login Response Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Login Success:', data);
  if (data.id) {
    console.log('✅ Backend API is working correctly!');
    console.log('User:', data.firstName, data.lastName);
    console.log('Roles:', data.roles);
    console.log('Active Role:', data.activeRole);
  }
})
.catch(error => {
  console.error('❌ Backend API Error:', error);
});

// Test other common login accounts
const testAccounts = [
  { email: 'test@vivaly.com', password: 'password123', role: 'parent' },
  { email: 'multiuser@example.com', password: 'password123', role: 'caregiver' },
  { email: 'sarah.johnson@example.com', password: 'password123', role: 'caregiver' }
];

console.log('Testing additional accounts...');
testAccounts.forEach((account, index) => {
  setTimeout(() => {
    fetch(`${BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(account)
    })
    .then(res => res.json())
    .then(data => {
      console.log(`Test ${index + 1} (${account.email}):`, data.firstName ? '✅ Success' : '❌ Failed');
    })
    .catch(err => console.error(`Test ${index + 1} failed:`, err));
  }, (index + 1) * 1000);
});