'use client'
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { createContext, useContext, useState } from 'react';
import { UserContext } from '../types';

const firebaseConfig = {
    apiKey: "AIzaSyCmM9nSO3MDnqW8-H7ZLObUb9pJk4sbJ2c",
    authDomain: "jobio-3607d.firebaseapp.com",
    projectId: "jobio-3607d",
    storageBucket: "jobio-3607d.appspot.com",
    messagingSenderId: "148825005553",
    appId: "1:148825005553:web:50c90e98d8e8bc0fe47850",
    measurementId: "G-YN6P7G7Z47"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const UserContext = createContext<UserContext | {}>({});

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    let prevUser: string | null = null;
    try {
        const storedUser = sessionStorage.getItem(`firebase:authUser:AIzaSyCmM9nSO3MDnqW8-H7ZLObUb9pJk4sbJ2c:[DEFAULT]`);
        if (typeof storedUser === 'string') {
            prevUser = JSON.parse(storedUser);
        }
    } catch {
        console.log('Unable to log sessionStorage on the server');
    };

    const [user, setUser] = useState<string | null>(prevUser);
    const [userRole, setUserRole] = useState<'org' | 'seeker' | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser, auth, userRole, setUserRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);