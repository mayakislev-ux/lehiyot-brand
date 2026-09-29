// Service worker מינימלי. בלי מטמון בכלל - אין סכנה לגרסה ישנה או לנתונים
// ישנים. קיים כדי שאפשר יהיה להתקין את הפורטל כאפליקציה, וכדי להודיע
// לאפליקציה פתוחה שעלתה גרסה חדשה.
//
// 27/09/2026 (מאיה: "הלקוחות לא יכולות לרענן ולא יודעות, ויש את האפליקציה
// בטלפון, חייבת שתפתרי את זה בלי רענון").
//
// הקובץ הזה נוצר בכל בנייה עם מזהה הבנייה בתוכו, ולכן התוכן שלו משתנה
// בכל העלאה. זה מה שגורם לדפדפן להחליף את ה-service worker, וזה עובד גם
// באפליקציה מותקנת שפתוחה כבר ימים. ברגע שהחדש נכנס לתוקף הוא מודיע לכל
// החלונות הפתוחים, והאפליקציה מרעננת את עצמה בשקט.
const BUILD = '1790690594845';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const win of windows) {
        win.postMessage({ type: 'portal-build', build: BUILD });
      }
    })()
  );
});

// חלון ששואל ישירות (למשל מיד כשחוזרים לאפליקציה בטלפון)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'portal-which-build') {
    event.source?.postMessage({ type: 'portal-build', build: BUILD });
  }
});

// 18/09/2026: מאזין fetch לטעינת עמודים בלבד (כרום בודק אותו לפני שהוא
// מציע התקנה). הוא רק מעביר את הבקשה לרשת, ובלי רשת מחזיר הודעה קצרה.
// שאר הבקשות (Firestore, קבצים, גוגל) לא עוברות דרכו בכלל.
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
