'use client'
import Form from 'react-bootstrap/Form';
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useUserContext } from '../context/userContext';
import { customPoster } from '../utils/fetch-requests';
import { UserContext } from '../types';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Error from '../components/error'

const SignUpPage: React.FC = () => {

    const [signUpError, setSignUpError] = useState<string | null>(null)
    const [error, setError] = useState<Error | null>(null);

    const { user, setUser, auth, setUserRole, idToken } = useUserContext() as UserContext;
    const router = useRouter();

    useEffect(() => {
        user && router.push('/user-account');
    })

    const handleSignUp = (event: React.ChangeEvent<any>) => {
        event.preventDefault();
        const email = event.target.elements.formPlaintextEmail.value;
        const password = event.target.elements.formPlaintextPassword.value;
        const role = event.target.elements.formPlaintextRole.value;

        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                return createUserWithEmailAndPassword(auth, email, password);
            })
            .then(async (userCredential) => {
                const newUser = userCredential.user;
                setUser(newUser);
                await addUserToDb(newUser.uid, role);
                setUserRole(role === 'Organization' ? 'org' : 'seeker')
                router.push('/user-account');
            })
            .catch((error) => {
                if (error.code = "auth/weak-password") {
                    const errorMessage = 'Password should be at least 6 characters long.'
                    setSignUpError(errorMessage)
                } else {
                    const errorMessage = 'Something went wrong, please try again later.'
                    setSignUpError(errorMessage)
                }
            });
    }

    const addUserToDb = (uid: string, role: string): void => {
        const reqPath = 'users/signUp';
        try {
            idToken && customPoster(idToken, reqPath, { uid, role });
        } catch (postingError: any) {
            setError(postingError)
        }
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-96 max-w-md p-8 space-y-8 bg-white border border-gray-300 rounded-md">
                <Form onSubmit={(event) => handleSignUp(event)}>
                    <h2 className="text-center text-xl mb-5">Sign Up</h2>

                    <div className="mt-8 space-y-6">
                        <Form.Group controlId="formPlaintextRole" className="mb-4">
                            <Form.Label className="block">Role</Form.Label>
                            <Form.Select className="mt-1 block w-full form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option>Job seeker</option>
                                <option>Organization</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formPlaintextEmail" className="mb-4">
                            <Form.Label className="block">Email</Form.Label>
                            <Form.Control type="email" placeholder="Email address" className="mt-1 block w-full form-input rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        </Form.Group>

                        <Form.Group controlId="formPlaintextPassword" className="mb-4">
                            <Form.Label className="block">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" className="mt-1 block w-full form-input rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        </Form.Group>

                        {signUpError && <p className="text-red-500 text-center">{signUpError}</p>}
                    </div>
                    <div className="flex flex-col items-center">
                        <button type="submit" className="text-white w-full px-4 py-2 bg-blue-400 border border-blue-600 text-black rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
                            Sign Up
                        </button>

                        <a href='/signin' className="mt-4 text-blue-600 hover:underline">Already have an account? Sign In!</a>
                    </div>
                </Form>
            </div>
        </div>


    );
}

export default SignUpPage;