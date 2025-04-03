import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    return (
        <header>
            <Navbar
                collapseOnSelect
                expand="lg"
                className="bg-primary navbar-dark shadow-sm"
                fixed="top"
            >
                <Container>
                    <Navbar.Brand as={Link} to="/" className="text-white">
                        Keep Notes
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {isAuthenticated && (
                                <>
                                    {/* <Nav.Link as={Link} to="/dashboard" className="text-white">
                                        Dashboard
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/notes" className="text-white">
                                        My Notes
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/addnote" className="text-white">
                                        Add Note
                                    </Nav.Link> */}
                                </>
                            )}
                        </Nav>
                        <Nav>
                            {!isAuthenticated && (
                                <Nav.Link as={Link} to="/register" className="text-white">
                                    Register
                                </Nav.Link>
                            )}
                            {isAuthenticated ? (
                                <Nav.Link
                                    onClick={handleLogout}
                                    className="text-white"
                                    style={{ cursor: "pointer" }}
                                    disabled={loading}
                                >
                                    {loading ? "Logging out..." : "Logout"}
                                </Nav.Link>
                            ) : (
                                <Nav.Link as={Link} to="/login" className="text-white">
                                    Login
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* Offset for fixed navbar */}
            <div style={{ paddingTop: "56px" }}></div>
        </header>
    );
};

export default Header;