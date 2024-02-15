'use client'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useUserContext } from '../context/userContext';
import { useRouter } from 'next/navigation';
import { UserContext } from '../types';
import Link from 'next/link';
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
        <div className='flex flex-col justify-center items-center h-screen'>
            <Form onSubmit={(event) => handleSignIn(event)}>
                <p className='text-3xl mb-10'>SIGN IN</p>
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
                {signInError && <p className='text-red-600'>{signInError}</p>}
                <Button variant="info" type="submit">
                    Submit
                </Button>
            </Form>
            <Link href='/signup'>Dont have an account? Sign Up!</Link>
        </div>
    );
}

export default SignInPage;