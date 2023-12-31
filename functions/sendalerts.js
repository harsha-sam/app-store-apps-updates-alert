require('dotenv').config();
const getAppDetails = require('../lib/getAppDetails');
const clientPromise = require('../lib/db');
const sendEmail = require('../lib/sendEmail');
const cron = require('node-cron');


const handler = async () => {
  try {
    const client = await clientPromise;
    const db = await client.db();
    const requests = await db.collection('alerts').find({}).toArray();
    for await (const request of requests) {
      const {
        appName, appId, appVersion, email
      } = request;
      const response = await getAppDetails(appId);
      if (!response) {
        continue;
      }
      const { version: currentVersion } = response;
      if (parseFloat(currentVersion) > parseFloat(appVersion)) {
        let html = `<p>${appName} App (App Id: ${appId})from the Apple App Store has been updated.</p>`;
        const emailOptions = {
          to: email,
          from: {
            name: 'Apple App Store Update Alerts',
            email: process.env.SENDER_MAIL,
          },
          subject: 'Alert',
          text: `${appName} App (App Id: ${appId}) from the Apple App Store has been updated.`,
          html,
        };
        await sendEmail(emailOptions);
        await db.collection('alerts').findOneAndUpdate(
          {
            appId,
            email,
          },
          {
            $set: {
              appVersion: currentVersion,
            },
          }
        );
      }
    }
  } catch (err) {
  }
};
cron.schedule('0 * * * *', handler);
