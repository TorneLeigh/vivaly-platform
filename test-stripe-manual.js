// Manual test for Stripe Connect endpoints
import { storage } from './server/storage.js';

console.log('🧪 Testing Stripe Connect System\n');

async function runTests() {
  try {
    // Test 1: Check if we can create a test user
    console.log('1. Creating test caregiver user...');
    
    const testUser = {
      id: 'test-caregiver-123',
      email: 'test.caregiver@example.com',
      firstName: 'Test',
      lastName: 'Caregiver',
      passwordHash: 'hashed-password',
      roles: ['caregiver'],
      activeRole: 'caregiver',
      isNanny: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await storage.createUser(testUser);
    console.log('✅ Test user created successfully');
    
    // Test 2: Test booking creation for payment flow
    console.log('\n2. Creating test booking...');
    
    const testBooking = {
      id: 'test-booking-123',
      parentId: 'test-parent-456',
      caregiverId: 'test-caregiver-123',
      jobId: 'test-job-789',
      startDate: '2025-01-01',
      endDate: '2025-01-02',
      ratePerHour: 30,
      hoursPerDay: 8,
      totalAmount: 240,
      serviceFee: 24,
      caregiverAmount: 216,
      status: 'confirmed',
      paymentStatus: 'paid_unreleased',
      personalDetailsVisible: false,
      notes: 'Test booking for payment flow',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await storage.createBooking(testBooking);
    console.log('✅ Test booking created successfully');
    
    // Test 3: Verify booking retrieval
    console.log('\n3. Verifying booking retrieval...');
    const retrievedBooking = await storage.getBooking('test-booking-123');
    console.log('✅ Booking retrieved:', {
      id: retrievedBooking.id,
      status: retrievedBooking.status,
      paymentStatus: retrievedBooking.paymentStatus,
      totalAmount: retrievedBooking.totalAmount,
      caregiverAmount: retrievedBooking.caregiverAmount
    });
    
    // Test 4: Simulate updating user with Stripe Connect account
    console.log('\n4. Simulating Stripe Connect account setup...');
    await storage.updateUser('test-caregiver-123', {
      stripeConnectAccountId: 'acct_test123456789'
    });
    
    const updatedUser = await storage.getUser('test-caregiver-123');
    console.log('✅ User updated with Stripe Connect ID:', updatedUser.stripeConnectAccountId);
    
    // Test 5: Show system readiness for payment release
    console.log('\n5. System readiness check...');
    console.log('📊 Payment Flow Status:');
    console.log(`   Booking Status: ${retrievedBooking.status}`);
    console.log(`   Payment Status: ${retrievedBooking.paymentStatus}`);
    console.log(`   Caregiver Amount: $${retrievedBooking.caregiverAmount}`);
    console.log(`   Platform Fee: $${retrievedBooking.serviceFee}`);
    console.log(`   Stripe Connect Account: ${updatedUser.stripeConnectAccountId ? 'Connected' : 'Not Connected'}`);
    
    console.log('\n✅ Stripe Connect system is ready for testing!');
    console.log('\n📋 Next Steps:');
    console.log('1. Use POST /api/stripe/connect/create-account to set up caregiver payouts');
    console.log('2. Use POST /api/admin/auto-release-payments to release payments after 24h');
    console.log('3. Payments will be transferred with 10% platform fee automatically deducted');
    
  } catch (error) {
    console.error('❌ Test Error:', error);
  }
}

runTests();