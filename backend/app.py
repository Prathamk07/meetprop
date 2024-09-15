from dotenv import load_dotenv
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import utils
import summarization
from config import MONGO_URI, GEMINI_API_KEY
import os
from flask_pymongo import PyMongo
from tkinter import Image
from bson import ObjectId
from flask import jsonify, request
import utils
import summarization
import fitz
import google.generativeai as genai
import pytesseract  # For OCR
import io


app = Flask(__name__)

VIDEO_FOLDER = f'C:\\Users\\prath\\Desktop\\meet_manager\\backend\\video\\'

AUDIO_FOLDER = f'C:\\Users\\prath\\Desktop\\meet_manager\\backend\\audio\\'

app = Flask(__name__)

load_dotenv()

app.config["MONGO_URI"]=os.getenv('MONGO_URI')

mongo = PyMongo(app)

CORS(app)

genai.configure(api_key=os.environ["GEMENI_KEY"])


@app.route('/hello')
def home():
    return "Welcome to the flask app"

@app.route('/new-meeting', methods = ['GET','POST'])
def newMeeting():
    if request.method == 'POST':
        meetings=mongo.db.meetings

        data=request.json
        print(data)
        meeting_id = meetings.insert_one({
            'title':data['title'],
            'desc' : data['desc'],
            'time' : data['time'],
            'date' : data['date']

        }).inserted_id
        return jsonify({'message' : 'Data added successfully', 'meeting_id' : str(meeting_id)})

    if request.method == 'GET':
        meetingList = mongo.db.meetings
        meetings = list(meetingList.find())

        for meeting in meetings:
            meeting['_id']=str(meeting['_id'])
        return jsonify(meetings)
    
@app.route('/meeting/<id>', methods=['GET'])
def getMeeting(id):

    try:
        # Convert id to ObjectId
        meetingid = ObjectId(id)
        print("meeting id is ",meetingid)
        # Fetch the single meeting document
        meetingFetch = mongo.db.meetings
        meeting = meetingFetch.find_one({'_id': meetingid})
        print('meeting :',meeting)

        if meeting:
            meeting['_id'] = str(meeting['_id'])  # Convert ObjectId to string
            return jsonify(meeting), 200
        else:
            return jsonify({'error': 'Meeting not found'}), 404
        
    except Exception as e:
        # Handle errors (e.g., invalid ObjectId format)
        return jsonify({'error': str(e)}), 500

@app.route('/upload/<id>', methods=['POST'])
def upload_file(id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    meetingId = ObjectId(id)
    print(meetingId)
    # Check file type
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    # Handle PDF files
    if file.filename.endswith('.pdf'):
        document = fitz.open(stream=file.read(), filetype='pdf')
        text = ""
        for page_num in range(len(document)):
            page = document.load_page(page_num)
            text += page.get_text()

    # Handle image files (e.g., PNG, JPEG)
    elif file.filename.endswith(('.png', '.jpg', '.jpeg')):
        image = Image.open(io.BytesIO(file.read()))
        text = pytesseract.image_to_string(image)

    else:
        return jsonify({'error': 'Unsupported file type'}), 400
    
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Generate agenda of the pre meeting document with text : "+text)
    print(response)
    
    meetingFetch = mongo.db.meetings
    meeting = meetingFetch.find_one_and_update(filter={'_id': meetingId},update={'$set':{"agenda": response.text} })
    print('meeting :',meeting)
    

    return jsonify({'summary': response.text}), 200


# Route to serve uploaded files for preview
# @app.route('/uploads/<filename>')
# def get_file(filename):
    # return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/summarize/<id>', methods=['POST'])
def summarize_meeting(id):
    try:
        # Get the uploaded video file
        # if 'file' not in request.files:
        #     return jsonify({"error": "No video file provided"})

        if 'file' in request.files:
            print("recieved")
        video_file = request.files['file']
        video_path = os.path.join(VIDEO_FOLDER, video_file.filename)
        video_file.save(video_path)
        print("saved")
        print(video_path)
        
        # Extract audio from video and save to AUDIO_PATH
        utils.extract_audio(video_path, AUDIO_FOLDER, video_file.filename)
        print("Audio extracted")

        utils.preprocess_audio(AUDIO_FOLDER)

        # Convert audio to text (transcription)
        transcript = utils.transcribe_audio(AUDIO_FOLDER)
        if transcript :
            print("transcript recieved :",transcript)
        else:
            print("Transcript failed")
        # Generate summary of the transcript
        print("generating summary")
        summary = summarization.summarize_text_advanced(transcript)
        if summary:
            print("summary :",summary)
        else:
            print("summary failed")
        meetingId=ObjectId(id)
        meetingFetch = mongo.db.meetings
        meeting=meetingFetch.find_one_and_update(filter={'_id': meetingId},update={'$set':{"summary": summary}})
        return jsonify({
            "transcript": transcript,
            "summary": summary
        })

    except Exception as e:
        # This will log the error and return a 500 Internal Server Error with a detailed message
        return jsonify({"error": str(e)}), 400


@app.route('/get-agenda/<id>', methods=['GET'])
def getAgenda(id):
    meetingId = ObjectId(id)
    meetingFetch = mongo.db.meetings
    meeting = meetingFetch.find_one({'_id': meetingId})



    if 'agenda' in meeting:
        return jsonify({"agenda" : meeting['agenda']})
    else:
        return jsonify({"agenda": "/text/ No agenda generated, please upload the pre meeting documentation to generate the agenda"})

@app.route('/get-summary/<id>', methods=['GET'])
def getSummary(id):
    meetingId=ObjectId(id)
    meetingFetch = mongo.db.meetings
    meeting = meetingFetch.find_one({'_id':meetingId})

    if 'summary' in meeting:
        return jsonify({'summary':meeting['summary']})
    else:
        return jsonify({"Summary":"no summary generated. please provide a mp4 file to continue"})

if __name__ == '__main__':
    app.run(debug=True)