importScripts(
  "https://www.gstatic.com/firebasejs/12.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const eventType = payload?.data?.event;
  if (eventType !== "booking.created" && eventType !== "inventory.low") {
    return;
  }

  const title =
    payload?.notification?.title ||
    (eventType === "booking.created"
      ? "New booking created"
      : "Inventory is running low");

  const body =
    payload?.notification?.body ||
    (eventType === "booking.created"
      ? "A new booking requires attention in the admin dashboard."
      : "An inventory item reached a low stock threshold.");

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.png",
    badge: "/favicon.png",
    data: payload?.data || {},
  });
});
