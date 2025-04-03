from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import mongo
from datetime import datetime
import uuid

class NoteList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        notes = list(mongo.db.notes.find({'user_id': user_id}))
        
        # Convert MongoDB document to JSON-serializable format
        serialized_notes = []
        for note in notes:
            serialized_note = {
                'id': str(note['_id']),
                'user_id': note['user_id'],
                'title': note['title'],
                'content': note['content'],
                'created_on': note['created_on'].isoformat(),  # Convert datetime to ISO string
                'last_update': note['last_update'].isoformat()
            }
            serialized_notes.append(serialized_note)
            
        return {'notes': serialized_notes}, 200
    
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        
        note_id = str(uuid.uuid4())
        note = {
            '_id': note_id,
            'user_id': user_id,
            'title': data['title'],
            'content': data['content'],
            'created_on': datetime.utcnow(),
            'last_update': datetime.utcnow()
        }
        
        mongo.db.notes.insert_one(note)
        return {'message': 'Note created successfully', 'id': note_id}, 201

class Note(Resource):
    @jwt_required()
    def get(self, note_id):
        user_id = get_jwt_identity()
        note = mongo.db.notes.find_one({'_id': note_id, 'user_id': user_id})
        
        if note:
            return {
                'id': str(note['_id']),
                'user_id': note['user_id'],
                'title': note['title'],
                'content': note['content'],
                'created_on': note['created_on'].isoformat(),  # Convert datetime to ISO string
                'last_update': note['last_update'].isoformat()  # Convert datetime to ISO string
            }, 200
        return {'message': 'Note not found'}, 404
    
    @jwt_required()
    def put(self, note_id):
        user_id = get_jwt_identity()
        data = request.get_json()
        
        updated_note = {
            'title': data['title'],
            'content': data['content'],
            'last_update': datetime.utcnow()
        }
        
        result = mongo.db.notes.update_one(
            {'_id': note_id, 'user_id': user_id},
            {'$set': updated_note}
        )
        
        if result.modified_count:
            return {'message': 'Note updated successfully'}, 200
        return {'message': 'Note not found or not updated'}, 404
    
    @jwt_required()
    def delete(self, note_id):
        user_id = get_jwt_identity()
        result = mongo.db.notes.delete_one({'_id': note_id, 'user_id': user_id})
        
        if result.deleted_count:
            return {'message': 'Note deleted successfully'}, 200
        return {'message': 'Note not found'}, 404