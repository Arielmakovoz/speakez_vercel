from flask import Flask, request, jsonify

import wave

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

@app.route('/api/process_audio', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({'error': 'No selected audio file'}), 400

    audio_duration = get_audio_duration(audio_file)
    
    return jsonify({'duration': audio_duration})

def get_audio_duration(audio_file):
    with wave.open(audio_file, 'rb') as audio:
        duration = float(audio.getnframes()) / audio.getframerate()
    return duration
#when I took out the backend.py from api and stutter model if worked
#Lucas wil get the Replicator to work and I will add
#we will downgrade down to hobby plan (or I will do it myself) and add santiagos new code