import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    clearCurrentNote,
} from '../features/noteSlice';
import { motion } from 'framer-motion';
import {
    Container, Row, Col, Form, Button, Alert, Card,
    Spinner, Modal, InputGroup, FormControl, Badge
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Home = () => {
    const dispatch = useDispatch();
    const { notes, loading, error, currentNote } = useSelector((state) => state.notes);
    const { user } = useSelector((state) => state.auth);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNotes, setFilteredNotes] = useState([]);

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    useEffect(() => {
        const filtered = notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredNotes(filtered);
    }, [searchTerm, notes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentNote) {
            dispatch(updateNote(currentNote.id, title, content))
                .then(() => toast.success('Note updated successfully'));
        } else {
            dispatch(addNote(title, content))
                .then(() => toast.success('Note added successfully'));
        }
        setTitle('');
        setContent('');
        dispatch(clearCurrentNote());
    };

    const handleEdit = (note) => {
        dispatch(setCurrentNote(note));
        setTitle(note.title);
        setContent(note.content);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (id) => {
        setNoteToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        dispatch(deleteNote(noteToDelete))
            .then(() => toast.success('Note deleted successfully'));
        setShowDeleteModal(false);
    };

    const handleCancel = () => {
        setTitle('');
        setContent('');
        dispatch(clearCurrentNote());
    };

    return (
        <Container className="py-4">
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this note? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row className="mb-4">
                <Col>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="fw-bold">
                            Good {getGreetingTime()}, {user?.username}!
                        </h2>
                        <p className="text-muted">Manage your notes below</p>
                    </motion.div>
                </Col>
            </Row>

            <Row>
                <Col lg={4} className="mb-4 mb-lg-0">
                    <motion.div whileHover={{ scale: 1.01 }}>
                        <Card className="shadow-sm h-100">
                            <Card.Body>
                                <Card.Title className="fw-bold mb-4">
                                    {currentNote ? 'Edit Note' : 'Add New Note'}
                                </Card.Title>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Note title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Content</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            placeholder="Note content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-flex gap-2">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={loading}
                                                className="flex-grow-1"
                                            >
                                                {loading ? (
                                                    <Spinner animation="border" size="sm" />
                                                ) : currentNote ? (
                                                    'Update Note'
                                                ) : (
                                                    'Add Note'
                                                )}
                                            </Button>
                                        </motion.div>

                                        {currentNote && (
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={handleCancel}
                                                    className="flex-grow-1"
                                                >
                                                    Cancel
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>

                <Col lg={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Card.Title className="fw-bold mb-0">Your Notes</Card.Title>
                                <Badge bg="primary" pill>
                                    {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
                                </Badge>
                            </div>

                            {/* Search Bar */}
                            <InputGroup className="mb-4">
                                <InputGroup.Text>
                                    <FiSearch />
                                </InputGroup.Text>
                                <FormControl
                                    placeholder="Search notes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>

                            {loading && (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Loading your notes...</p>
                                </div>
                            )}

                            {error && (
                                <Alert variant="danger" className="text-center">
                                    {error}
                                </Alert>
                            )}

                            {!loading && filteredNotes.length === 0 && (
                                <Alert variant="info" className="text-center">
                                    {searchTerm ?
                                        'No notes match your search' :
                                        'No notes yet. Create your first note!'}
                                </Alert>
                            )}

                            <Row xs={1} md={2} className="g-3">
                                {filteredNotes.map((note) => (
                                    <Col key={note.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            layout
                                        >
                                            <Card className="h-100">
                                                <Card.Body>
                                                    <Card.Title>{note.title}</Card.Title>
                                                    <Card.Text className="text-muted">
                                                        {note.content.length > 100
                                                            ? `${note.content.substring(0, 100)}...`
                                                            : note.content}
                                                    </Card.Text>
                                                </Card.Body>
                                                <Card.Footer className="bg-transparent border-top-0">
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEdit(note)}
                                                            className="d-flex align-items-center gap-1"
                                                        >
                                                            <FiEdit2 size={14} /> Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(note.id)}
                                                            className="d-flex align-items-center gap-1"
                                                        >
                                                            <FiTrash2 size={14} /> Delete
                                                        </Button>
                                                    </div>
                                                </Card.Footer>
                                            </Card>
                                        </motion.div>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

function getGreetingTime() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
}

export default Home;