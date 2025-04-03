// src/utils/pushNotificationUtils.js
import admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = path.resolve('./src/services/service-account.json');  // Replace with actual path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app();  // If already initialized, use the existing app
}

// Send a push notification to the provided device token
export const sendPushNotification = async (deviceToken, title, body) => {
  const message = {
    token: deviceToken,  // User's device token
    notification: {
      title: title,
      body: body,
    },
    android: {
      priority: 'high',
    },
    apns: {
      headers: {
        'apns-priority': '10',
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw new Error('Failed to send push notification');
  }
};
