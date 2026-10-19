import cron from 'node-cron';
import { cleanupInactiveGuestUsers } from './cleanupGuestUsers';

/**
 * Initializes all background cron jobs for the backend service.
 */
export function initCronJobs() {
  // Run nightly at 03:00 AM server time (cron: '0 3 * * *')
  cron.schedule('0 3 * * *', async () => {
    console.log('[Cron Job] Executing nightly guest user cleanup...');
    try {
      await cleanupInactiveGuestUsers(24);
    } catch (error) {
      console.error('[Cron Job] Failed to clean up inactive guest users:', error);
    }
  });

  console.log('[Cron Job] Nightly guest cleanup scheduled to run at 03:00 AM daily.');
}
