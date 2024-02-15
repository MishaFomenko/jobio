'use client'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useUserContext } from '../context/userContext';
import { customPoster } from '../utils/fetch-requests';
import { UserContext } from '../types';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        return <p>Error occured</p>
    }

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <Form onSubmit={(event) => handleSignUp(event)}>
                <p className='text-3xl mb-10'>SIGN UP</p>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextRole">
                    <Form.Label column sm="10">
                        Role
                    </Form.Label>
                    <Form.Select size="sm">
                        <option>Job seeker</option>
                        <option>Organization</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label column sm="10">
                        Email
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="email" placeholder="Email address" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="10">
                        Password
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="password" placeholder="Password" />
                    </Col>
                </Form.Group>
                {signUpError && <p className='text-red-600'>{signUpError}</p>}
                <Button variant="info" type="submit" >
                    Submit
                </Button>
            </Form>
            <Link href='/signin'>Already have an account? Sign In!</Link>
        </div>
    );
}

export default SignUpPage;