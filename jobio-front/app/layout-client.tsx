'use client';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { UserContextProvider } from './context/userContext';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const NavBar = dynamic(() => import('./components/navBar'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })
const queryClient = new QueryClient()

const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" className='h-full bg-white'>
            <body className={inter.className}>
                <main>
                    <QueryClientProvider client={queryClient}>
                        <UserContextProvider>
                            <NavBar />
                            {children}
                        </UserContextProvider>
                    </QueryClientProvider>
                </main>
            </body>
        </html>
    );
};

export default ClientRootLayout;