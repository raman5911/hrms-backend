const cron = require('node-cron');
const { sendReminders } = require('../controllers/RequestHandleController');

// Schedule the cron job to run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
    console.log('Running reminder job every 15 minutes...');
    await sendReminders();
});

// module.exports = {}; // Export if needed
