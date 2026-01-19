import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firestore } from '../services/firebase/firebase';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
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
    register: (email: string, password: string, role: Role) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('Firebase auth state changed:', firebaseUser?.email);

            if (firebaseUser) {
                try {
                    // Загружаем профиль из Firestore
                    const userProfile = await loadUserProfile(firebaseUser);
                    setUser(userProfile);
                } catch (error) {
                    console.error('Error loading user profile:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loadUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
        const docRef = doc(firestore, 'users', firebaseUser.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            return snapshot.data() as UserProfile;
        } else {
            // Создаем базовый профиль
            const basicProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                role: 'patient',
            };
            await setDoc(docRef, basicProfile);
            return basicProfile;
        }
    };

    const register = async (email: string, password: string, role: Role) => {
        setLoading(true);
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const profile: UserProfile = {
                uid: credential.user.uid,
                email,
                role,
            };
            await setDoc(doc(firestore, 'users', credential.user.uid), profile);
            setUser(profile);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Пользователь установится через onAuthStateChanged
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};