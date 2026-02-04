
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAZ29vZNYms93grq_E7135XkuhTe53jKPo",
  authDomain: "gen-lang-client-0523904999.firebaseapp.com",
  projectId: "gen-lang-client-0523904999",
  storageBucket: "gen-lang-client-0523904999.firebasestorage.app",
  messagingSenderId: "311949425178",
  appId: "1:311949425178:web:eae85ce0bbc813c7452fa3",
  measurementId: "G-4H79QWLH3X"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
