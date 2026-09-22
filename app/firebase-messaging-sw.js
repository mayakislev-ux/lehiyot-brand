// 20/09/2026: Service Worker של ההתראות. חייב לשבת בשורש האתר בשם הזה.
// ההגדרות כאן הן ההגדרות הציבוריות של האתר (אותן כמו בדפדפן), בלי סודות.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  "apiKey": "AIzaSyAkBJTbBjJ4nxj7lmv1WKEUPzFxIqXGUJw",
  "authDomain": "maya-client-portal.firebaseapp.com",
  "projectId": "maya-client-portal",
  "storageBucket": "maya-client-portal.firebasestorage.app",
  "messagingSenderId": "229998599068",
  "appId": "1:229998599068:web:35b795876db0fc6dcd0659"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  self.registration.showNotification(d.title || 'המהלך השיווקי', {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    dir: 'rtl',
    lang: 'he',
    tag: d.tag || 'portal',
    data: { url: d.url || '/portal/home' },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/portal/home';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) { c.navigate(url); return c.focus(); }
      }
      return self.clients.openWindow(url);
    })
  );
});
