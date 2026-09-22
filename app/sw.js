// Service worker מינימלי: קיים כדי שאפשר יהיה להתקין את הפורטל כאפליקציה.
// בלי מטמון בכלל - אין סכנה לגרסה ישנה או לנתונים ישנים.
// 18/09/2026: יש מאזין fetch לטעינת עמודים בלבד (כרום בודק אותו לפני שהוא
// מציע התקנה). הוא רק מעביר את הבקשה לרשת, ובלי רשת מחזיר הודעה קצרה.
// שאר הבקשות (Firestore, קבצים, גוגל) לא עוברות דרכו בכלל.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response(
          '<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>אין חיבור</title><body style="font-family:system-ui;padding:32px;text-align:center"><h1>אין חיבור לאינטרנט</h1><p>הפורטל יחזור ברגע שהחיבור יחזור.</p></body></html>',
          { headers: { 'content-type': 'text/html; charset=utf-8' } }
        )
    )
  );
});
