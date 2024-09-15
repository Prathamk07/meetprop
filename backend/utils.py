import wave
from moviepy.editor import VideoFileClip
from vosk import Model, KaldiRecognizer
from pydub import AudioSegment
from pydub.effects import normalize


model = Model(r"C:\\Users\\prath\\Desktop\\meet_manager\\backend\\model\\vosk-lite")

def extract_audio(video_path, audio_output_path, filename):
    """Extract audio from video and save as WAV file."""
    print("video path is :",video_path)
    audio_output_path=audio_output_path+"\\"
    print("audio output path is : ",audio_output_path)
    video = VideoFileClip(video_path)
    audio = video.audio
    audio_output_path=audio_output_path+"audio.wav"
    audio.write_audiofile(audio_output_path, codec='pcm_s16le')

def preprocess_audio(audio_path):
    # Load audio and convert to mono and normalize volume
    print('preprocess path : ',audio_path)
    audio = AudioSegment.from_file(audio_path+"\\audio.wav")
    audio = audio.set_channels(1)
    audio = normalize(audio)
    
    # Export the audio to a WAV file with 16000 Hz sampling rate
    audio = audio.set_frame_rate(16000)
    audio.export("audio\processed_audio.wav", format="wav")
    print("audio preprocessed")

def transcribe_audio(audio_path):
    """Transcribe the audio file to text using Vosk."""
    # model = Model("model")  # Path to pre-trained Vosk model
    print("opening")
    print(audio_path)
    wf = wave.open(audio_path+"processed_audio.wav", "rb")
    print("wav opened")
    rec = KaldiRecognizer(model, wf.getframerate())
    transcript = ""
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            result = rec.Result()
            transcript += result
    return transcript

