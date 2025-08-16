import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJvYApE3YGC6c7842BZ2dIbi6ZgEw9JNg",
  authDomain: "mystore-28245.firebaseapp.com",
  projectId: "mystore-28245",
  storageBucket: "mystore-28245.firebasestorage.app",
  messagingSenderId: "662257366556",
  appId: "1:662257366556:web:cec34fe33f06b4e6db11d9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
