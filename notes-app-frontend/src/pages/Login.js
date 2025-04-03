import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../features/authSlice';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }))
            .unwrap()
            .then(() => navigate('/'))
            .catch((err) => console.error('Login error:', err));
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
                                        <h2 className="fw-bold">Login</h2>
                                        <p className="text-muted">Welcome back to Keep Notes</p>
                                    </div>

                                    {error && (
                                        <Alert variant="danger" className="text-center">
                                            {error}
                                        </Alert>
                                    )}

                                    <Form onSubmit={handleSubmit}>
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

                                        <Form.Group className="mb-4">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
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
                                                {loading ? 'Logging in...' : 'Login'}
                                            </Button>
                                        </motion.div>

                                        <div className="text-center text-muted mt-4">
                                            Don't have an account?{' '}
                                            <Link to="/register" className="text-decoration-none">
                                                Register here
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

export default Login;