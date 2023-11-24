'use client'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useUserContext } from '../context/userContext';
import { useRouter } from 'next/navigation';
import { UserContext } from '../types';

const SignInPage: React.FC = () => {

    const { setUser, auth } = useUserContext() as UserContext;
    const router = useRouter();

    const handleSignIn = (event: any) => {
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
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <div className='flex justify-center items-center h-screen'>
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
                <Button variant="info" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default SignInPage;