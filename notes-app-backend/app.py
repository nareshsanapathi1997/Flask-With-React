from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager  
from dotenv import load_dotenv
import os
from resources.user import UserRegister, UserLogin
from resources.note import Note, NoteList
from db import mongo

# Load environment variables - ensure .env is in same directory
load_dotenv(verbose=True)  # Added verbose flag to show if .env loaded

# Initialize Flask app
app = Flask(__name__)

# Enhanced configuration with default values for development
app.config.update(
    JWT_SECRET_KEY=os.getenv('JWT_SECRET_KEY'),
    MONGO_URI=os.getenv('MONGO_URI'),
    JWT_ACCESS_TOKEN_EXPIRES=3600  # 1 hour expiration
)

# Validate configurations with more helpful error messages
required_configs = {
    'JWT_SECRET_KEY': "JWT_SECRET_KEY not found in .env file",
    'MONGO_URI': "MONGO_URI not found in .env file"
}

for key, error_msg in required_configs.items():
    if not app.config.get(key):
        raise RuntimeError(f"Configuration error: {error_msg}\n"
                         f"Please check your .env file in {os.path.abspath('.env')}")

# Initialize extensions with additional configuration
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"]  # Adjust based on your frontend URL
    }
})

api = Api(app)
jwt = JWTManager(app)

# Add helpful debug endpoint (remove in production)
@app.route('/config-check')
def config_check():
    return {
        'jwt_secret_configured': bool(app.config['JWT_SECRET_KEY']),
        'mongo_configured': bool(app.config['MONGO_URI']),
        'env_file_path': os.path.abspath('.env') if os.path.exists('.env') else 'Not found'
    }

# API Resources
api.add_resource(UserRegister, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(NoteList, '/notes')
api.add_resource(Note, '/notes/<string:note_id>')

if __name__ == '__main__':
    try:
        mongo.init_app(app)
        print("Successfully connected to MongoDB!")
        print(f"JWT Secret: {'*' * 32 if app.config['JWT_SECRET_KEY'] else 'Not configured'}")
        app.run(port=5000, debug=True)
    except Exception as e:
        print(f"Failed to start application: {str(e)}")
        raise