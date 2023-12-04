'use client'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { signOut } from "firebase/auth";
import { useUserContext } from '../context/userContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from '../types';

const NavBar: React.FC = () => {

    const { user, setUser, auth } = useUserContext() as UserContext;
    const router = useRouter();

    const handleSignOut = () => {
        signOut(auth).then(() => {
            setUser(null);
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    useEffect(() => {
        user === null && router.push('/signin');
    })


    return (
        <>
            {['xxl'].map((expand) => (
                <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
                    <Container fluid>
                        <Navbar.Brand >JOBIO</Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        {
                            user !== null
                            &&
                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-${expand}`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                placement="end"
                            >
                                <Offcanvas.Header closeButton closeVariant="white">
                                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                        Offcanvas
                                    </Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Nav className="justify-content-end flex-grow-1 pe-3">
                                        <Link className='p-2 mx-4' href="/">Home</Link>
                                        <Link className='p-2 mx-4' href='/user-account'>Account</Link>
                                        <Button className='mx-4' variant='info' onClick={handleSignOut}>SignOut</Button>
                                    </Nav>
                                </Offcanvas.Body>
                            </Navbar.Offcanvas>
                        }
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export default NavBar;