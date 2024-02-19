'use client'
import JobSeekerAccount from '../components/seekerAccount';
import OrgAccount from '../components/orgAccount';
import { useUserContext } from '../context/userContext';
import React, { useEffect, useState } from 'react';
import { customGetter, customDeleter } from '../utils/fetch-requests';
import { UserContext } from '../types';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { deleteUser } from "firebase/auth";


const UserAccountPage: React.FC = () => {

    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [deletingAccount, setDeletingAccount] = useState<boolean>(false)
    const [wrongEmail, setWrongEmail] = useState<boolean>(false)

    const router = useRouter();

    const { user, userRole, setIdToken, setUserRole, idToken } = useUserContext() as UserContext;

    const reqPath = 'profileData/userRole';
    const queryString = `userID=${user?.uid}`;
    const userRoleQuery = useQuery({
        queryKey: ['userRoleQuery', idToken, reqPath, queryString],
        queryFn: () => customGetter(idToken, reqPath, queryString),
        enabled: Boolean(idToken) || Boolean(user)
    })

    useEffect(() => {
        !user && router.push('/signin')
        user && !userRoleQuery.isPending && setUserRole(userRoleQuery.data[0].role)

        setError(userRoleQuery.error)
        setPending(userRoleQuery.isPending)
    }, [userRoleQuery.isPending, user])

    const handleDeleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const email = event.currentTarget.elements.namedItem('email');
        if (user && user.email === email) {
            deleteUser(user).then(() => {
                const reqPath = 'profileData/deleteAccount'
                const queryString = `userID=${user?.uid}`
                user && idToken && customDeleter(idToken, reqPath, queryString)
            })
                .then(() => {
                    setUserRole(null)
                    setIdToken(null)
                    sessionStorage.clear()
                    router.push('/signin')
                })
                .catch((error: string) => {
                    console.log('Deleting your account failed with an error: ', error)
                });
        } else {
            setWrongEmail(true)
        }
    }

    if (pending) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error occured</p>
    }
    return (
        <>
            {userRole && userRole === 'org' && <OrgAccount />}
            {userRole && userRole === 'seeker' && <JobSeekerAccount />}
            <div className='max-w-4xl mx-auto p-4 my-4 bg-white shadow rounded-lg'>
                {!deletingAccount
                    ?
                    <button onClick={() => setDeletingAccount(true)} type='submit' className='w-full bg-red-400 text-white font-semibold hover:bg-red-500 py-2 rounded transition duration-300'>
                        Delete your account
                    </button>
                    :
                    <form onSubmit={e => handleDeleteAccount(e)}>
                        <div className='mb-4'>
                            <label htmlFor='password' className='block text-sm font-medium text-red-500'>Enter your email to delete your account forever</label>
                            <input type='email' id='email' name='email' required className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm' placeholder='Type your password' />
                        </div>
                        {wrongEmail && <p className='text-red-500'>Wrong email!</p>}
                        <button type='submit' className='w-1/2 bg-red-400 text-white font-semibold hover:bg-red-500 py-2 rounded transition duration-300'>
                            I am sure I want to delete my account forever
                        </button>
                        <button onClick={() => (setDeletingAccount(false), setWrongEmail(false))} className='w-1/2 bg-green-400 text-white font-semibold hover:bg-green-500 py-2 rounded transition duration-300'>
                            Cancel
                        </button>
                    </form>
                }
            </div>

        </>
    )
}

export default UserAccountPage