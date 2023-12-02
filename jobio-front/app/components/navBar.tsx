'use client'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
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
                                        <Link href="/">Home</Link>
                                        <Button variant='info' onClick={handleSignOut}>SignOut</Button>
                                        <Link href='/user-account'>Account</Link>
                                    </Nav>
                                    {/* <Form className="d-flex">
                                    <Form.Control
                                        type="search"
                                        placeholder="Search"
                                        className="me-2"
                                        aria-label="Search"
                                    />
                                    <Button variant="outline-success">Search</Button>
                                </Form> */}
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