import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';
import { createUserDocument, getUserDocument } from './firestore';

// Sign up new customer
export const signUpCustomer = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await createUserDocument(user.uid, {
      email: email,
      role: 'customer',
      status: 'active',
    });
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign up new vendor (pending approval)
export const signUpVendor = async (email, password, vendorInfo) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore with pending status
    await createUserDocument(user.uid, {
      email: email,
      role: 'pending_vendor',
      status: 'pending',
      vendorInfo: vendorInfo,
    });
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in existing user
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Listen to auth state changes and get user data from Firestore
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get additional user data from Firestore
      const { user: userData } = await getUserDocument(user.uid);
      callback({ ...user, ...userData });
    } else {
      callback(null);
    }
  });
};

// Get current user's role
export const getUserRole = async (uid) => {
  const { user } = await getUserDocument(uid);
  return user?.role || null;
};