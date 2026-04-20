importScripts(
  "https://www.gstatic.com/firebasejs/12.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.12.0/firebase-messaging-compat.js",
);

function getFirebaseConfigFromSearch() {
  const url = new URL(self.location.href);
  const searchParams = url.searchParams;

  return {
    apiKey: searchParams.get("apiKey") || "",
    authDomain: searchParams.get("authDomain") || "",
    projectId: searchParams.get("projectId") || "",
    storageBucket: searchParams.get("storageBucket") || "",
    messagingSenderId: searchParams.get("messagingSenderId") || "",
    appId: searchParams.get("appId") || "",
    measurementId: searchParams.get("measurementId") || undefined,
  };
}

function hasRequiredFirebaseConfig(config) {
  return Boolean(
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId,
  );
}

const firebaseConfig = getFirebaseConfigFromSearch();

if (!hasRequiredFirebaseConfig(firebaseConfig)) {
  console.warn("FCM service worker missing Firebase config", {
    hasApiKey: Boolean(firebaseConfig.apiKey),
    hasAuthDomain: Boolean(firebaseConfig.authDomain),
    hasProjectId: Boolean(firebaseConfig.projectId),
    hasStorageBucket: Boolean(firebaseConfig.storageBucket),
    hasMessagingSenderId: Boolean(firebaseConfig.messagingSenderId),
    hasAppId: Boolean(firebaseConfig.appId),
  });
} else {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const eventType = payload?.data?.event;
    const fallbackByEvent = {
      "booking.created": {
        title: "New booking created",
        body: "A new booking requires attention in the admin dashboard.",
      },
      "booking.ongoing": {
        title: "Booking in progress",
        body: "A booking has moved to ongoing status.",
      },
      "inventory.low": {
        title: "Inventory is running low",
        body: "An inventory item reached a low stock threshold.",
      },
    };

    const fallback = fallbackByEvent[eventType] || {
      title: "Admin notification",
      body: "You have a new admin notification.",
    };

    const title = payload?.notification?.title || fallback.title;

    const body = payload?.notification?.body || fallback.body;

    self.registration.showNotification(title, {
      body,
      icon: "/favicon.png",
      badge: "/favicon.png",
      data: payload?.data || {},
    });
  });
}
