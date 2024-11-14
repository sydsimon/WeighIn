from flask import Flask, g, jsonify, request
import sqlite3
from googleapiclient import discovery
import json

app = Flask(__name__)
DATABASE = 'data/polls.db'

# Initialize Perspective API client
API_KEY = 'AIzaSyDODqNb52YIx-E_-qHiwE0fk04j2qeoVCo'
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

# Existing database functions remain the same...
# [Previous database functions]

@app.route('/add-poll', methods=['POST'])
def add_poll():
    data = request.get_json()
    question = data.get('question')
    
    # Check question toxicity
    toxicity_score = check_toxicity(question)
    if toxicity_score and toxicity_score > 0.7:  # Threshold can be adjusted
        return jsonify({
            "error": "Question contains inappropriate content. Please rephrase.",
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
    
    # Continue with existing poll creation logic
   # [Rest of the existing add_poll function]

@app.route('/add-response', methods=['POST'])
def add_response():
    data = request.get_json()
    userid = data.get('userid')
    questionid = data.get('questionid')
    response = data.get('response')
    
    if not all([userid, questionid, response]):
        return jsonify({"error": "User ID, Question ID, and Response are required."}), 400
        
    # Get response text based on response number
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        f"SELECT response{response} FROM polls WHERE questionid = ?", 
        (questionid,)
    )
    response_text = cursor.fetchone()
    
    if response_text:
        toxicity_score = check_toxicity(response_text[0])
        if toxicity_score and toxicity_score > 0.7:
            return jsonify({
                "error": "Response contains inappropriate content.",
                "toxicity_score": toxicity_score
            }), 400
    
    # Continue with existing response logic
    # [Rest of the existing add_response function]

if __name__ == '__main__':
    app.run(debug=True)