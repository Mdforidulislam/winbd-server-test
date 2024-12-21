import twilio from 'twilio';
const client = new twilio('YOUR_ACCOUNT_SID', 'YOUR_AUTH_TOKEN');

client.messages.create({
    body: 'Your OTP is 123456',
    to: '+1234567890',  // the recipient's phone number
    from: '+0987654321' // your Twilio number
})
.then((message) => console.log(message.sid))
.catch((error) => console.error(error));


