import { initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBTJHH4xY902WimmagICWVDpwj5hp_ZGtQ",
    authDomain: "burncalc.firebaseapp.com",
    projectId: "burncalc",
    storageBucket: "burncalc.firebasestorage.app",
    messagingSenderId: "476210638956",
    appId: "1:476210638956:android:61d72dffb99be2f56b6849",
};

const app = initializeApp(firebaseConfig);

// Для старых версий Firebase
export const auth = FirebaseAuth.initializeAuth(app, {
    persistence: (FirebaseAuth as any).getReactNativePersistence(AsyncStorage)
});

export const firestore = getFirestore(app);