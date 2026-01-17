import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firestore } from '../services/firebase/firebase';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type Role = 'doctor' | 'patient';

export interface UserProfile {
    uid: string;
    email: string;
    role: Role;
    fullName?: string;
}

interface AuthContextProps {
    user: UserProfile | null;
    loading: boolean;
    register: (email: string, password: string, role: Role, doctorCode?: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const DOCTOR_SECRET = 'BURN';

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // Загружаем профиль из Firestore
                const docRef = doc(firestore, 'users', firebaseUser.uid);
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    setUser(snapshot.data() as UserProfile);
                } else {
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email!, role: 'patient' });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const register = async (email: string, password: string, role: Role, doctorCode?: string) => {
        // Проверка для врачей
        if (role === 'doctor') {
            if (doctorCode !== DOCTOR_SECRET) {
                throw new Error('Неверный код подтверждения врача');
            }
        }

        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const profile: UserProfile = {
            uid: credential.user.uid,
            email,
            role,
        };
        await setDoc(doc(firestore, 'users', credential.user.uid), profile);
        setUser(profile);
    };

    const login = async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const docRef = doc(firestore, 'users', credential.user.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            setUser(snapshot.data() as UserProfile);
        } else {
            throw new Error('Профиль пользователя не найден!');
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
