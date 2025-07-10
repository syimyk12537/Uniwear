import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './config';

const getFriendlyError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    default:
      return error.message;
  }
};

export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      cart: []
    });
    return userCredential.user;
  } catch (error) {
    throw new Error(getFriendlyError(error));
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(getFriendlyError(error));
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error(getFriendlyError(error));
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};