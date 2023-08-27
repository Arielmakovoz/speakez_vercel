from flask import Flask, request, jsonify
import os
import wave

app = Flask(__name__)

@app.route('/api/process_audio', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({'error': 'No selected audio file'}), 400

    audio_path = 'uploads/' + audio_file.filename
    audio_file.save(audio_path)

    audio_duration = get_audio_duration(audio_path)
    os.remove(audio_path)

    return jsonify({'duration': audio_duration})

def get_audio_duration(audio_path):
    audio = wave.open(audio_path, 'rb')
    duration = float(audio.getnframes()) / audio.getframerate()
    audio.close()
    return duration
#when I took out the backend.py from api and stutter model if worked
#Lucas wil get the Replicator to work and I will add
#we will downgrade down to hobby plan (or I will do it myself) and add santiagos new code