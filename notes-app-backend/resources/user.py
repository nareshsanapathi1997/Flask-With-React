from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token
from db import mongo
import bcrypt
from datetime import datetime
import uuid

class UserRegister(Resource):
    def post(self):
        data = request.get_json()
        
        # Check if user exists
        if mongo.db.users.find_one({'email': data['email']}):
            return {'message': 'User already exists'}, 400
            
        # Hash password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user_id = str(uuid.uuid4())
        user = {
            '_id': user_id,
            'username': data['username'],
            'email': data['email'],
            'password': hashed_password.decode('utf-8'),
            'created_on': datetime.utcnow(),
            'last_update': datetime.utcnow()
        }
        
        mongo.db.users.insert_one(user)
        return {'message': 'User created successfully'}, 201

class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        user = mongo.db.users.find_one({'email': data['email']})
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
            access_token = create_access_token(identity=str(user['_id']))
            return {
                'access_token': access_token,
                'user': {
                    'id': str(user['_id']),
                    'username': user['username'],
                    'email': user['email']
                }
            }, 200
            
        return {'message': 'Invalid credentials'}, 401