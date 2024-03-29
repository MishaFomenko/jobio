'use client'
import * as FirebaseAuth from "firebase/auth";
import { initializeApp } from "firebase/app";
import { createContext, useContext, useState } from 'react';
import { UserContext, CustomUser } from '../types';

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

const auth = FirebaseAuth.getAuth(app);

const UserContext = createContext<UserContext | {}>({});

export const UserContextProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    let prevUser: CustomUser | null = null;
    let prevIdToken: string | null = null;
    try {
        const storedUser = sessionStorage.getItem(`firebase:authUser:AIzaSyCmM9nSO3MDnqW8-H7ZLObUb9pJk4sbJ2c:[DEFAULT]`);
        if (typeof storedUser === 'string') {
            prevUser = JSON.parse(storedUser);
        }
        const storedIdToken = sessionStorage.getItem('idToken');
        if (typeof storedIdToken === 'string') {
            prevIdToken = storedIdToken;
        }

    } catch {
        console.log('Unable to log sessionStorage on the server');
    };

    const [user, setUser] = useState<CustomUser | null>(prevUser);
    const [userRole, setUserRole] = useState<'org' | 'seeker' | null>(null);
    const [idToken, setIdToken] = useState<string | null>(prevIdToken);

    const newTokenRetrievalCondition = user && (!idToken || new Date(user.stsTokenManager.expirationTime) < new Date() || user.stsTokenManager.accessToken !== prevIdToken)

    if (newTokenRetrievalCondition) {
        FirebaseAuth.onAuthStateChanged(auth, (user) => {
            if (user) {
                FirebaseAuth.getIdToken(user, true).then(function (idToken: string) {
                    sessionStorage.setItem('idToken', idToken)
                    setIdToken(idToken)
                }).catch(function (error: string) {
                    console.log('Retreiving ID Token failed with an error: ', error)
                });
            }
        });
    }

    return (
        <UserContext.Provider value={{ user, setUser, auth, userRole, setUserRole, idToken, setIdToken }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);