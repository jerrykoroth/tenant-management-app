import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For development - you should replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'tenant-management-demo.firebaseapp.com',
  projectId: 'tenant-management-demo',
  storageBucket: 'tenant-management-demo.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
