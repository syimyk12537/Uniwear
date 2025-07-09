// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB48Fb7KFUVxmEA1l7ORtblpZ73cPtondU",
  authDomain: "uniwear-68aa2.firebaseapp.com",
  projectId: "uniwear-68aa2",
  storageBucket: "uniwear-68aa2.firebasestorage.app",
  messagingSenderId: "273101812551",
  appId: "1:273101812551:web:bbb50eccf51a3b368a5262",
  measurementId: "G-B174S5THER"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};