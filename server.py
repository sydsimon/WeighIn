from flask import Flask, g, jsonify, request
import sqlite3

app = Flask(__name__)
DATABASE = 'data/polls.db'

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

if __name__ == '__main__':
    app.run(debug=True)
