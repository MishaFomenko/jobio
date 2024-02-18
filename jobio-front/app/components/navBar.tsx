'use client'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { signOut } from "firebase/auth";
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types';
import { useRouter } from 'next/navigation';

const NavBar: React.FC = () => {

    const { user, setUser, auth } = useUserContext() as UserContext;

    const router = useRouter();

    const handleSignOut = () => {
        signOut(auth).then(() => {
            setUser(null);
        }).catch((error: Error) => {
            console.log('Sign-out failed with an error: ', error)
        });
    }

    const handleHomeClick = () => {
        router.push('/')
    }

    const handleAccountClick = () => {
        router.push('/user-account')
    }

    return (
        <div>
            {['xxl'].map((expand) => (
                <Navbar key={expand} expand={expand} variant="light" className="bg-white shadow-sm mb-3">
                    <Container fluid>
                        <Navbar.Brand className="font-weight-bold text-orange-600">JOBIO</Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        {user !== null && (
                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-${expand}`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                placement="end"
                            >
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                        Menu
                                    </Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Nav className="justify-content-end flex-grow-1 pe-3">
                                        <button
                                            onClick={handleHomeClick}
                                            className="ml-3 py-2 px-4 border-blue-200 text-blue-500 transition-colors duration-200 ease-in-out rounded border-1 hover:shadow-lg"
                                        >
                                            Home
                                        </button>
                                        <button
                                            onClick={handleAccountClick}
                                            className="ml-3 py-2 px-4 border-blue-200 text-blue-500 transition-colors duration-200 ease-in-out rounded border-1 hover:shadow-lg"
                                        >
                                            Account
                                        </button>
                                        <button
                                            onClick={handleSignOut}
                                            className="ml-3 py-2 px-4 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 ease-in-out rounded"
                                        >
                                            Sign Out
                                        </button>

                                    </Nav>
                                </Offcanvas.Body>
                            </Navbar.Offcanvas>
                        )}
                    </Container>
                </Navbar>
            ))}

        </div>

    );
}

export default NavBar;