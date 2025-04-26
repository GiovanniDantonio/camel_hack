from flask import Flask, request, jsonify, session
import json
import requests
import time
import threading
import logging
from datetime import datetime
import sys
import signal
import psutil
import subprocess

def kill_port_5000():
    try:
        # Find process using port 5000
        result = subprocess.run(['lsof', '-i', ':5000'], capture_output=True, text=True)
        if result.stdout:
            # Get the PID from the output
            lines = result.stdout.strip().split('\n')
            if len(lines) > 1:  # Skip header line
                pid = lines[1].split()[1]
                # Kill the process
                subprocess.run(['kill', '-9', pid])
                print(f"Killed process {pid} running on port 5000")
    except Exception as e:
        print(f"Error killing port 5000: {e}")


app = Flask(__name__)
app.secret_key = 'supersecretkey'

users = [
    {"id": 1, "username": "user1", "email": "user1@example.com"},
    {"id": 2, "username": "user2", "email": "user2@example.com"},
    {"id": 3, "username": "user3", "email": "user3@example.com"},
    {"id": 4, "username": "user4", "email": "user4@example.com"},
    {"id": 5, "username": "user5", "email": "user5@example.com"}
]

mock_user = {"username": "admin", "password": "password"}


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if data.get('username') == mock_user['username'] and data.get('password') == mock_user['password']:
        session['logged_in'] = True
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('logged_in', None)
    return jsonify({"message": "Logged out successfully"}), 200


@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users), 200


@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    if not session.get('logged_in'):
        return jsonify({"message": "Unauthorized"}), 401
    user = next((user for user in users if user['id'] == user_id), None)
    if user:
        return jsonify(user), 200
    return jsonify({"message": "User not found"}), 404


if __name__ == '__main__':
    kill_port_5000()
    app.run(debug=False)
