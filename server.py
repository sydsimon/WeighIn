from flask import Flask, g, jsonify, request
import sqlite3

app = Flask(__name__)
DATABASE = 'polls.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
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
        responseid INTEGER PRIMARY KEY AUTOINCREMENT,
        userid INTEGER NOT NULL,
        questionid INTEGER NOT NULL,
        response TEXT,
        FOREIGN KEY (userid) REFERENCES users(userid),
        FOREIGN KEY (questionid) REFERENCES polls(questionid)
    )''')

    db.commit()

with app.app_context():
    init_db()

@app.route('/add-user', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
    db.commit()
    return jsonify({"message": "User added successfully!"})

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

    db = get_db()
    cursor = db.cursor()
    cursor.execute('''INSERT INTO polls (authorid, question, description, start_time, response1, response2, response3, response4) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                   (authorid, question, description, start_time, response1, response2, response3, response4))
    db.commit()
    return jsonify({"message": "Poll added successfully!"})

@app.route('/add-response', methods=['POST'])
def add_response():
    data = request.get_json()
    userid = data.get('userid')
    questionid = data.get('questionid')
    response = data.get('response')

    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO responses (userid, questionid, response) VALUES (?, ?, ?)", (userid, questionid, response))
    db.commit()
    return jsonify({"message": "Response added successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
