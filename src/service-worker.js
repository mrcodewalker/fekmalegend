// service-worker.js

self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'assets/icon.png' // Update with your icon path
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Handle the notification click event, e.g., open a URL
});
