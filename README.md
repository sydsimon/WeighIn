# WeighIn

# Project Description: "WeighIn"

"WeighIn" is a crowdsourcing platform designed to tackle indecisiveness in group decision-making by allowing users to post questions or dilemmas and receive multiple-choice feedback from the crowd. Targeting college students and young adults, the platform functions like a social media tool where users can seek opinions on everyday decisions—ranging from where to eat, what to wear, or even broader life choices. Participants provide responses anonymously, and their answers are aggregated to reveal the most popular choice after three days.

# Instructions
Go to website: https://weigh-in-sydney-simons-projects.vercel.app/ 

1. Log in or create an account (Top right)
2. If you want to create a poll, click on the “Create Poll” button and fill in all the necessary information. Click “Create Poll" at the bottom of the page to submit
3. Alternatively, click on a poll from the home page that you want to answer. Select one of the four options to cast your vote.
Note: In case some functionality is not working, please email any of the following email addresses: brilu100@seas.upenn.edu, ngmolina@seas.upenn.edu, sydsimon@sas.upenn.edu, hcasper@seas.upenn.edu, mwalli@seas.upenn.edu

# Instruction Video


# Project Components 
* User Sign In: 2 points
* Post Question: 1 points
* Respond to a Question: 1 Point
* Censor Question + Responses: 4 points
* Aggregate Results: 4 Points
* Database Setup: 4 points
* Display Results / Frontend: 3 points
* Profile Page with results

# Flow Chart

<img width="931" alt="Screenshot 2024-11-11 at 11 00 10 PM" src="https://github.com/user-attachments/assets/d1208bdd-78fd-4fe3-9d98-663426ffd3ca">

# UI/UX
<img width="988" alt="Screenshot 2024-11-11 at 11 17 38 PM" src="https://github.com/user-attachments/assets/f2108a5a-235c-40e2-a71c-f3d86c642822">


# Milestones 
* Database Setup - Nov 12th
* Aggregation and quality control - Nov 14th
* Post + Respond to Question - Nov 19th
* User Sign in - Nov 19thFlask
* Display Results / Frontend - Nov 19th
* Profile Page with results - Nov 24th

# Where to find things
* Raw data: WeighIn/data/polls.db (open with sqlite or alternative) 
* Sample input/output for QC: WeighIn/quality_control_data.txt
* Sample input/output for aggregation: WeighIn/data/polls.db (open with sqlite or alternative) 
* Code for QC: WeighIn/server.py, in routes: '/get-random-quality-control-poll', '/check-quality-control-response'
* Code for aggregation: WeighIn/server.py, in route: '/max-response-per-question'

# How the code runs 
Quality Control:
* Quality control questions need to be answered upon sign in to ensure users are human and can respond to the correct reponse when prompted. Can find this in WeighIn/server.py, in routes: '/get-random-quality-control-poll', '/check-quality-control-response'
* Toxicity chec: When the user adds a poll, first the header, descriptions and responses input are put through a toxicity check iwth the Perspective API. Can find this code in WeighIn/server.py, in route: '/add-poll'
 
Aggregation:
* Each poll has the responses aggregated within the backend and these results are passed to the frontend to display which response won. The aggregation methos is in WeighIn/server.py, in route: '/max-response-per-question' and '/get-poll-results/<int:questionid>'

Code Stack: Vite + React frontend and Flask backend

# Analysis
We will be doing analysis about how well our application can scale in terms of time and money
