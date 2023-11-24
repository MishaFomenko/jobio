'use client';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { UserContextProvider } from './context/userContext';
import React from 'react';

const NavBar = dynamic(() => import('./components/navBar'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" className='h-full bg-white'>
            <body className={inter.className}>
                <main>
                    <UserContextProvider>
                        <NavBar />
                        {children}
                    </UserContextProvider>
                </main>
            </body>
        </html>
    );
};

export default ClientRootLayout;