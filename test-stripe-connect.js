const BASE_URL = 'http://localhost:5000';

async function testStripeConnect() {
  console.log('🧪 Testing Stripe Connect Integration\n');
  
  try {
    // Test 1: Create Connect Account (without authentication first to see the structure)
    console.log('1. Testing Connect Account Creation...');
    
    const connectResponse = await fetch(`${BASE_URL}/api/stripe/connect/create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Caregiver',
        email: 'caregiver@test.com',
        dateOfBirth: '1990-01-01',
        address: {
          line1: '123 Test Street',
          city: 'Sydney',
          state: 'NSW',
          postcode: '2000'
        },
        bankAccount: {
          accountHolderName: 'Test Caregiver',
          bsb: '123-456',
          accountNumber: '12345678'
        }
      })
    });
    
    const connectResult = await connectResponse.text();
    console.log('Connect Account Response Status:', connectResponse.status);
    console.log('Connect Account Response:', connectResult.substring(0, 200));
    
    // Test 2: Check Connect Status
    console.log('\n2. Testing Connect Status Check...');
    
    const statusResponse = await fetch(`${BASE_URL}/api/stripe/connect/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const statusResult = await statusResponse.text();
    console.log('Status Response Status:', statusResponse.status);
    console.log('Status Response:', statusResult.substring(0, 200));
    
    // Test 3: Test Release Payments endpoint
    console.log('\n3. Testing Release Payments...');
    
    const releaseResponse = await fetch(`${BASE_URL}/api/admin/auto-release-payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const releaseResult = await releaseResponse.text();
    console.log('Release Payments Response Status:', releaseResponse.status);
    console.log('Release Payments Response:', releaseResult.substring(0, 200));
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

// Run the test
testStripeConnect();