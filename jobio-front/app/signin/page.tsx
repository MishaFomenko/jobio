'use client'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useUserContext } from '../context/userContext';
import { useRouter } from 'next/navigation';
import { UserContext } from '../types';
import { useState, useEffect } from 'react'

const SignInPage: React.FC = () => {

    const [signInError, setSigninError] = useState<string | null>(null)
    const { setUser, auth, user } = useUserContext() as UserContext;
    const router = useRouter();
    useEffect(() => {
        user && router.push('/user-account');
    })

    const handleSignIn = (event: React.ChangeEvent<any>) => {
        event.preventDefault();
        const email = event.target.elements.formPlaintextEmail.value;
        const password = event.target.elements.formPlaintextPassword.value;

        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password);
            })
            .then((userCredential) => {
                const newUser = userCredential.user;
                setUser(newUser);
                router.push('/user-account');
            })
            .catch((error) => {
                if (error.code === "auth/invalid-login-credentials") {
                    const errorMessage = 'Invalid email or password.'
                    setSigninError(errorMessage)
                } else {
                    const errorMessage = 'Something went wrong, please try again later.'
                    setSigninError(errorMessage)
                }
            });
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-96 p-5 border border-gray-300 rounded bg-white">
                <Form onSubmit={(event) => handleSignIn(event)}>
                    <h2 className="text-center text-xl mb-5">Sign In</h2>
                    <Form.Group className="mb-4" controlId="formPlaintextEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Email address" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="formPlaintextPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </Form.Group>
                    {signInError && <p className="text-red-500 text-center">{signInError}</p>}
                    <div className="flex flex-col items-center">
                        <button className="text-white w-full px-4 py-2 bg-blue-400 border border-blue-600 text-black rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50" type="submit">
                            Sign In
                        </button>
                        <a href='/signup' className="mt-4 text-blue-600 hover:underline">Don't have an account? Sign Up!</a>
                    </div>
                </Form>
            </div>
        </div>



    );
}

export default SignInPage;