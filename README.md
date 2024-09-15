# MeetProps
MeetProps is an AI tool for generation of Agenda through the Pre-Meeting document submission/ It also allows the Generation of summary of meeting when submitted the video recording of meeting using AI models

# Pre-requirements
- Python : v3.12
- MongoDB Atlas
- NodeJS and npm
- pip

# Installation
Flask 
```
cd backend 
pip install flask dotenv pymongo flask_cors flask_pymongo --user
```
Install Additional dependencies for AI model
```
pip install fitz numpy scipy tensorflow pytesseract transformers pydub vosk moviepy --user
```
Install Google Generative AI for the prompt based outputs
```
pip install google-generative-ai --user
cd ..
```

Installing React Dependencies
```
cd frontend
npm i
```

# Using
```
cd backend
python app.py
```
```
cd frontend
npm start
```


