from flask import Blueprint, jsonify, request
import random
from server import get_db

quality_control_bp = Blueprint('quality_control', __name__)

@quality_control_bp.route('/get-random-quality-control-poll', methods=['GET'])
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

@quality_control_bp.route('/check-quality-control-response', methods=['POST'])
def check_quality_control_response():
    data = request.get_json()
    userid = data.get('userid')
    questionid = data.get('questionid')
    response = data.get('response')

    if not all([userid, questionid, response]):
        return jsonify({"error": "User ID, Question ID, and Response are required."}), 400

    db = get_db()
    cursor = db.cursor()

    # Query to get the correct response for the quality control poll
    cursor.execute("SELECT response1, response2, response3, response4 FROM polls WHERE questionid = ?", (questionid,))
    poll = cursor.fetchone()
    if not poll:
        return jsonify({"error": "Poll not found."}), 404

    correct_response = next(i for i, r in enumerate(poll, start=1) if r is not None and response == i)

    return jsonify({"is_correct": correct_response}), 200