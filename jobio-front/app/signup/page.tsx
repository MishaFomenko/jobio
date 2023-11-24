'use client'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useUserContext } from '../context/userContext';
import { customPoster } from '../utils/fetch-requests';
import { UserContext } from '../types';
import React from 'react';

const SignUpPage: React.FC = () => {

    const { setUser, auth } = useUserContext() as UserContext;

    const handleSignUp = (event: any) => {
        event.preventDefault();
        const email = event.target.elements.formPlaintextEmail.value;
        const password = event.target.elements.formPlaintextPassword.value;
        const role = event.target.elements.formPlaintextRole.value;

        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                return createUserWithEmailAndPassword(auth, email, password);
            })
            .then((userCredential) => {
                const newUser = userCredential.user;
                setUser(newUser);
                addUserToDb(newUser.uid, role);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const addUserToDb = (uid: string, role: string) => {
        const reqPath = 'newUserSignUp';
        customPoster(reqPath, { uid, role });
    }



    return (
        <div className='flex justify-center items-center h-screen'>
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
                <Button variant="info" type="submit" >
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default SignUpPage;