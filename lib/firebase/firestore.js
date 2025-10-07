import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from './config';

const db = getFirestore(app);

// Create a user document in Firestore
export const createUserDocument = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user data from Firestore
export const getUserDocument = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { user: userSnap.data(), error: null };
    } else {
      return { user: null, error: 'User not found' };
    }
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export { db };