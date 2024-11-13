import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAuTf3Zdj6OESalm_THYlyUiRpdbDPEAB4",
  authDomain: "sismarmo-d148d.firebaseapp.com",
  projectId: "sismarmo-d148d",
  storageBucket: "sismarmo-d148d.firebasestorage.app",
  messagingSenderId: "44879384459",
  appId: "1:44879384459:web:df65974cc0c281b043a98e",
  measurementId: "G-2PV77MSW5M"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);