// =============================================
//  ضع هنا إعدادات Firebase الخاصة بمشروعك
//  Get these from: Firebase Console → Project Settings → Your Apps
// =============================================
const firebaseConfig = {
    apiKey: "AIzaSyDIpRN6t21eNPT-3AOenyA8av7Y3ecMlTM",
    authDomain: "vault-of-curses.firebaseapp.com",
    projectId: "vault-of-curses",
    storageBucket: "vault-of-curses.firebasestorage.app",
    messagingSenderId: "233532891838",
    appId: "1:233532891838:web:84a3c1e59a2aa9be7ff4ef",
    measurementId: "G-XM8356XWRS"
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
