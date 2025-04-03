import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../features/authSlice';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        dispatch(register({ username, email, password }))
            .unwrap()
            .then(() => {
                toast.success('Registration successful! Please login.');
                navigate('/login');
            })
            .catch((err) => {
                toast.error(err.message || 'Registration failed');
                console.error('Registration error:', err);
            });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="d-flex align-items-center min-vh-100 py-5"
        >
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <motion.div whileHover={{ scale: 1.01 }}>
                            <Card className="shadow-sm">
                                <Card.Body className="p-4 p-sm-5">
                                    <div className="text-center mb-4">
                                        <h2 className="fw-bold">Create Account</h2>
                                        <p className="text-muted">Join Keep Notes today</p>
                                    </div>

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Create password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="w-100 mb-3"
                                                disabled={loading}
                                            >
                                                {loading ? 'Registering...' : 'Create Account'}
                                            </Button>
                                        </motion.div>

                                        <div className="text-center text-muted mt-4">
                                            Already have an account?{' '}
                                            <Link to="/login" className="text-decoration-none">
                                                Login here
                                            </Link>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default Register;