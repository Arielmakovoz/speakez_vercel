from flask import Flask, request, jsonify
import audioread
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

    audio_type = get_audio_type(audio_file)
    if audio_type != 'audio/wav':
        return jsonify({'error': 'Unsupported audio file type'}), 400
    
def get_audio_type(audio_file):
    with audioread.audio_open(audio_file) as f:
        return f.mime_type

#when I took out the backend.py from api and stutter model if worked
#Lucas wil get the Replicator to work and I will add
#we will downgrade down to hobby plan (or I will do it myself) and add santiagos new code