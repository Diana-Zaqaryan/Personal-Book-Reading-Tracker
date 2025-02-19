importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAkFImHeUGnlC9fDyCbu470P5uYkKsDhkg",
  authDomain: "personal-book-reading-tracker.firebaseapp.com",
  databaseURL:
    "https://personal-book-reading-tracker-default-rtdb.firebaseio.com",
  projectId: "personal-book-reading-tracker",
  storageBucket: "personal-book-reading-tracker.firebasestorage.app",
  messagingSenderId: "36914128884",
  appId: "1:36914128884:web:70b26c00b6117c377bfba1",
  measurementId: "G-GZF8V597M4",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
