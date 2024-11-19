from flask import Flask, g, jsonify, request
import sqlite3
from googleapiclient import discovery
import json
from dotenv import load_dotenv
import os
# from quality_control import quality_control_bp
import re
from flask_cors import CORS

app = Flask(__name__)

###make sure to change this for production###
CORS(app, resources={r"/*": {"origins": "*"}})
###make sure to change this for production###

load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, 'data', 'polls.db')
# app.register_blueprint(quality_control_bp, url_prefix='/quality-control')



# Initialize Perspective API client
API_KEY = os.getenv("API_KEY")
client = discovery.build(
    "commentanalyzer",
    "v1alpha1",
    developerKey=API_KEY,
    discoveryServiceUrl="https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1",
    static_discovery=False,
)

def check_toxicity(text):
    analyze_request = {
        'comment': {'text': text},
        'requestedAttributes': {'TOXICITY': {}}
    }
    
    try:
        response = client.comments().analyze(body=analyze_request).execute()
        toxicity_score = response["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
        return toxicity_score
    except Exception as e:
        print(f"Error checking toxicity: {e}")
        return None

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.execute("PRAGMA foreign_keys = ON;")
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    cursor = db.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        userid INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS polls (
        questionid INTEGER PRIMARY KEY AUTOINCREMENT,
        authorid INTEGER NOT NULL,
        question TEXT NOT NULL,
        description TEXT,
        start_time TEXT,
        response1 TEXT,
        response2 TEXT,
        response3 TEXT,
        response4 TEXT,
        FOREIGN KEY (authorid) REFERENCES users(userid)
    )''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS responses (
        userid INTEGER NOT NULL,
        questionid INTEGER NOT NULL,
        response INTEGER,
        PRIMARY KEY (userid, questionid),
        FOREIGN KEY (userid) REFERENCES users(userid),
        FOREIGN KEY (questionid) REFERENCES polls(questionid)
    )''')

    db.commit()

    # add_mock_data(cursor)
    # db.commit()

def add_mock_data(cursor):
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        users = [
            ('alice', 'password123'),
            ('bob', 'securepass'),
            ('carol', 'mypassword'),
            ('dave', 'davepass'),
            ('eve', 'evepassword'),
            ('frank', 'franksecure'),
            ('grace', 'gracepass'),
            ('heidi', 'heidipassword')
        ]
        cursor.executemany("INSERT INTO users (username, password) VALUES (?, ?)", users)

    cursor.execute("SELECT COUNT(*) FROM polls")
    if cursor.fetchone()[0] == 0:
        polls = [
            (1, "What's your favorite programming language?", "Choose the one you use most frequently.", "2024-11-01 10:00", "Python", "JavaScript", "Java", "C++"),
            (2, "Do you prefer remote work?", "Let us know your preference.", "2024-11-02 09:00", "Yes", "No", "Sometimes", "Never"),
            (3, "Which meal do you like most?", "Pick your favorite meal.", "2024-11-03 08:00", "Breakfast", "Lunch", "Dinner", "Snacks")
        ]
        cursor.executemany('''INSERT INTO polls (authorid, question, description, start_time, response1, response2, response3, response4) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)''', polls)


    cursor.execute("SELECT COUNT(*) FROM responses")
    if cursor.fetchone()[0] == 0:
        responses = [
            (1, 1, 1),
            (2, 1, 2),
            (3, 1, 1),
            (4, 1, 3),
            (5, 1, 1),
            (6, 1, 2),
            (7, 1, 1),
            (8, 1, 4),

            (1, 2, 1),
            (2, 2, 1),
            (3, 2, 3),
            (4, 2, 1),
            (5, 2, 2),
            (6, 2, 1),
            (7, 2, 4),
            (8, 2, 1),

            (1, 3, 3),
            (2, 3, 2),
            (3, 3, 3),
            (4, 3, 2),
            (5, 3, 3),
            (6, 3, 1),
            (7, 3, 3),
            (8, 3, 4)
        ]
        cursor.executemany("INSERT INTO responses (userid, questionid, response) VALUES (?, ?, ?)", responses)

with app.app_context():
    init_db()

@app.route('/add-user', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        db.commit()
        return jsonify({"message": "User added successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "User could not be added."}), 500

@app.route('/add-poll', methods=['POST'])
def add_poll():
    data = request.get_json()
    authorid = data.get('authorid')
    question = data.get('question')
    description = data.get('description')
    start_time = data.get('start_time')
    response1 = data.get('response1')
    response2 = data.get('response2')
    response3 = data.get('response3')
    response4 = data.get('response4')

    if not all([authorid, question, start_time, response1, response2, response3, response4]):
        return jsonify({"error": "All fields except description are required."}), 400
    
    # Check question toxicity
    toxicity_score = check_toxicity(question)
    if toxicity_score and toxicity_score > 0.7:  
        return jsonify({
            "error": "Question contains inappropriate content. Please rephrase.",
            "toxicity_score": toxicity_score
        }), 400
    
    # Check question toxicity
    toxicity_score = check_toxicity(description)
    if toxicity_score and toxicity_score > 0.7:  
        return jsonify({
            "error": "Description contains inappropriate content. Please rephrase.",
            "toxicity_score": toxicity_score
        }), 400
    
    # Check response options toxicity
    for i in range(1, 5):
        response = data.get(f'response{i}')
        if response:
            toxicity_score = check_toxicity(response)
            if toxicity_score and toxicity_score > 0.7:
                return jsonify({
                    "error": f"Response option {i} contains inappropriate content. Please rephrase.",
                    "toxicity_score": toxicity_score
                }), 400
    

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('''INSERT INTO polls (authorid, question, description, start_time, response1, response2, response3, response4) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                       (authorid, question, description, start_time, response1, response2, response3, response4))
        db.commit()
        return jsonify({"message": "Poll added successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Poll could not be added."}), 500

@app.route('/add-response', methods=['POST'])
def add_response():
    data = request.get_json()
    userid = data.get('userid')
    questionid = data.get('questionid')
    response = data.get('response')

    if not all([userid, questionid, response]):
        return jsonify({"error": "User ID, Question ID, and Response are required."}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT response1, response2, response3, response4 FROM polls WHERE questionid = ?", (questionid,))
    poll = cursor.fetchone()
    if not poll:
        return jsonify({"error": "Poll not found."}), 404

    if response not in [1, 2, 3, 4]:
        return jsonify({"error": "Invalid response option."}), 400

    try:
        cursor.execute("INSERT INTO responses (userid, questionid, response) VALUES (?, ?, ?)", (userid, questionid, response))
        db.commit()
        return jsonify({"message": "Response added successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Response already exists or could not be added."}), 500

@app.route('/max-response-per-question', methods=['GET'])
def max_response_per_question():
    db = get_db()
    cursor = db.cursor()

    cursor.execute('''
        SELECT questionid, response, COUNT(response) AS response_count
        FROM responses
        GROUP BY questionid, response
    ''')

    results = cursor.fetchall()

    response_counts = {}
    for questionid, response, count in results:
        if questionid not in response_counts:
            response_counts[questionid] = []
        response_counts[questionid].append((response, count))

    max_responses = {}
    for questionid, counts in response_counts.items():
        max_response = max(counts, key=lambda x: x[1])
        cursor.execute("SELECT response1, response2, response3, response4 FROM polls WHERE questionid = ?", (questionid,))
        poll_responses = cursor.fetchone()
        if poll_responses and 1 <= max_response[0] <= 4:
            response_text = poll_responses[max_response[0] - 1]
        else:
            response_text = "Unknown"

        max_responses[questionid] = {
            "response": {
                "option_number": max_response[0],
                "text": response_text
            },
            "count": max_response[1]
        }

    return jsonify(max_responses), 200

@app.route('/get-poll-results/<int:questionid>', methods=['GET'])
def get_poll_results(questionid):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT question, response1, response2, response3, response4 FROM polls WHERE questionid = ?", (questionid,))
    poll = cursor.fetchone()
    if not poll:
        return jsonify({"error": "Poll not found."}), 404

    question, r1, r2, r3, r4 = poll

    cursor.execute('''
        SELECT response, COUNT(response) AS count
        FROM responses
        WHERE questionid = ?
        GROUP BY response
    ''', (questionid,))
    response_counts = cursor.fetchall()

    response_map = {
        1: r1,
        2: r2,
        3: r3,
        4: r4
    }

    results = {response_map.get(resp, "Unknown"): count for resp, count in response_counts}

    return jsonify({
        "questionid": questionid,
        "question": question,
        "results": results
    }), 200

@app.route('/get-random-quality-control-poll', methods=['GET'])
def get_random_quality_control_poll():
    db = get_db()
    cursor = db.cursor()

    # Query to get a random poll with authorid 0
    cursor.execute("SELECT * FROM polls WHERE authorid = 0 ORDER BY RANDOM() LIMIT 1")
    poll = cursor.fetchone()

    if not poll:
        return jsonify({"error": "No quality control poll found."}), 404

    questionid, authorid, question, description, start_time, r1, r2, r3, r4 = poll

    return jsonify({
        "questionid": questionid,
        "question": question,
        "description": description,
        "start_time": start_time,
        "response1": r1,
        "response2": r2,
        "response3": r3,
        "response4": r4
    }), 200


@app.route('/check-quality-control-response', methods=['POST'])
def check_quality_control_response():
    data = request.get_json()
    userid = data.get('userid')
    questionid = data.get('questionid')
    response = data.get('response')

    if not all([userid, questionid, response]):
        return jsonify({"error": "User ID, Question ID, and Response are required."}), 400

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT question, response1, response2, response3, response4
        FROM polls 
        WHERE questionid = ? AND authorid = 0
    """, (questionid,))
    
    poll = cursor.fetchone()
    if not poll:
        return jsonify({"error": "Quality control question not found."}), 404

    question_text, *options = poll

    # Extract the correct answer text from the question (text within quotes)
    match = re.search(r'"(.*?)"', question_text)
    if not match:
        return jsonify({"error": "No correct answer specified in question text."}), 400

    correct_text = match.group(1).strip().lower()

    correct_option_index = next((i + 1 for i, option in enumerate(options) if option and option.strip().lower() == correct_text), None)

    if correct_option_index is None:
        return jsonify({"error": "Correct answer not found in response options."}), 400

    is_correct = str(response) == str(correct_option_index)

    return jsonify({"is_correct": is_correct}), 200

@app.route('/get-polls', methods=['GET'])
def get_polls():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT questionid, authorid, question, description, start_time, 
               response1, response2, response3, response4 
        FROM polls 
        WHERE authorid != 0 
        ORDER BY start_time DESC
    """)
    
    polls = cursor.fetchall()

    # Convert polls to list of dictionaries
    poll_list = []
    for poll in polls:
        poll_dict = {
            "id": poll[0],
            "authorId": poll[1],
            "question": poll[2],
            "description": poll[3],
            "startTime": poll[4],
            "response1": poll[5],
            "response2": poll[6],
            "response3": poll[7],
            "response4": poll[8]
        }
        poll_list.append(poll_dict)

    return jsonify(poll_list), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
