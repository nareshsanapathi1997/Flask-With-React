import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    notes: [],
    loading: false,
    error: null,
    currentNote: null,
};

const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        fetchNotesStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchNotesSuccess(state, action) {
            state.notes = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchNotesFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        addNoteStart(state) {
            state.loading = true;
            state.error = null;
        },
        addNoteSuccess(state, action) {
            state.notes.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        addNoteFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateNoteStart(state) {
            state.loading = true;
            state.error = null;
        },
        updateNoteSuccess(state, action) {
            const index = state.notes.findIndex(note => note.id === action.payload.id);
            if (index !== -1) {
                state.notes[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        updateNoteFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteNoteStart(state) {
            state.loading = true;
            state.error = null;
        },
        deleteNoteSuccess(state, action) {
            state.notes = state.notes.filter(note => note.id !== action.payload);
            state.loading = false;
            state.error = null;
        },
        deleteNoteFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        setCurrentNote(state, action) {
            state.currentNote = action.payload;
        },
        clearCurrentNote(state) {
            state.currentNote = null;
        },
    },
});

export const {
    fetchNotesStart,
    fetchNotesSuccess,
    fetchNotesFailure,
    addNoteStart,
    addNoteSuccess,
    addNoteFailure,
    updateNoteStart,
    updateNoteSuccess,
    updateNoteFailure,
    deleteNoteStart,
    deleteNoteSuccess,
    deleteNoteFailure,
    setCurrentNote,
    clearCurrentNote,
} = noteSlice.actions;

export const fetchNotes = () => async (dispatch, getState) => {
    dispatch(fetchNotesStart());
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/notes', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(fetchNotesSuccess(response.data.notes));
    } catch (error) {
        dispatch(fetchNotesFailure(error.response?.data?.message || 'Failed to fetch notes'));
    }
};

export const addNote = (title, content) => async (dispatch, getState) => {
    dispatch(addNoteStart());
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            'http://localhost:5000/notes',
            { title, content },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        dispatch(addNoteSuccess({ id: response.data.id, title, content }));
    } catch (error) {
        dispatch(addNoteFailure(error.response?.data?.message || 'Failed to add note'));
    }
};

export const updateNote = (id, title, content) => async (dispatch, getState) => {
    dispatch(updateNoteStart());
    try {
        const token = localStorage.getItem('token');
        await axios.put(
            `http://localhost:5000/notes/${id}`,
            { title, content },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        dispatch(updateNoteSuccess({ id, title, content }));
    } catch (error) {
        dispatch(updateNoteFailure(error.response?.data?.message || 'Failed to update note'));
    }
};

export const deleteNote = (id) => async (dispatch, getState) => {
    dispatch(deleteNoteStart());
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/notes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(deleteNoteSuccess(id));
    } catch (error) {
        dispatch(deleteNoteFailure(error.response?.data?.message || 'Failed to delete note'));
    }
};

export default noteSlice.reducer;