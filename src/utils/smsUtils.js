// src/utils/smsUtils.js
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Twilio Auth Token
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio Phone Number

const client = twilio(accountSid, authToken);

// Send SMS
export const sendSMS = async (to, message) => {
  try {
    const messageDetails = await client.messages.create({
      body: message,
      from: fromPhoneNumber,  // Sender's Twilio number
      to: to,                 // Recipient's phone number
    });

    console.log('SMS sent successfully:', messageDetails.sid);
    return messageDetails;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS');
  }
};
