// server.js
const webPush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Replace with your VAPID keys
const vapidKeys = {
  publicKey: 'BOWBtppXNZzcL1YiZzh5dvTHKVR6Ul3dmD0RuD7TF_b9uXlH67bSm6dXi32LanfetLMSskrg9M_nWwmf63KxJN8',
  privateKey: 'rrhah5dOl97HzK8B_4CpYftLHFi45XYtE-vIpGYFpJY'
};

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  res.status(201).json({});

  const payload = JSON.stringify({
    title: 'Event Reminder',
    body: 'Your event is starting soon!'
  });

  webPush.sendNotification(subscription, payload)
    .catch(error => console.error('Error sending notification:', error));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
