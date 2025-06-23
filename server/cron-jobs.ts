// server/cron-jobs.ts
// Automatic payment release system (Airbnb-style)

import * as cron from 'node-cron';

// Run every hour to check for payments to release
const AUTO_RELEASE_CRON = '0 * * * *'; // Every hour

export function startPaymentReleaseCron() {
  console.log('Starting automatic payment release cron job...');
  
  cron.schedule(AUTO_RELEASE_CRON, async () => {
    try {
      console.log('Running automatic payment release check...');
      
      // Call the internal API endpoint
      const response = await fetch('http://localhost:5000/api/admin/release-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer internal-cron-token' // Add auth if needed
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`Payment release completed: ${result.releasedCount} payments released`);
        
        if (result.releasedCount > 0) {
          console.log(`💰 Released ${result.releasedCount} payments automatically (Airbnb-style 24h delay)`);
        }
      } else {
        console.error('Failed to release payments:', response.statusText);
      }
    } catch (error) {
      console.error('Error in payment release cron job:', error);
    }
  });
  
  console.log('✅ Payment release cron job started - will run every hour');
}