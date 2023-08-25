from flask import Flask, request, jsonify
from backend import speech_fluency
#hiiiiiii
app = Flask(__name__)

@app.route('/api/echo', methods=['POST'])
def echo():
    data = request.json
    word = data.get('word')
    speech_fluency('speech_audio.wav')
    return jsonify({'echoed_word': word})