import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBTJHH4xY902WimmagICWVDpwj5hp_ZGtQ",
    authDomain: "burncalc.firebaseapp.com",
    projectId: "burncalc",
    storageBucket: "burncalc.firebasestorage.app",
    messagingSenderId: "476210638956",
    appId: "1:476210638956:android:61d72dffb99be2f56b6849",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
