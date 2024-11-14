from flask import Blueprint, jsonify, request
import random
from server import get_db
import re

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
