import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCI7C4Fdfy0YmCwpkKWnCCsAvipZYv_i7I",
  authDomain: "portal-kelulusan-lazuardi.firebaseapp.com",
  projectId: "portal-kelulusan-lazuardi",
  storageBucket: "portal-kelulusan-lazuardi.firebasestorage.app",
  messagingSenderId: "1023280937568",
  appId: "1:1023280937568:web:52164a8dade1d2057b6105"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Auth service
export const auth = getAuth(app);
