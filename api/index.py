from flask import Flask, request, jsonify
#from backend import speech_fluency
#hiiiiiii
app = Flask(__name__)

@app.route('/api/send-message', methods=['POST'])
def send_message():
    data = request.json
    #speech_fluency('stutter_audio.wav')
    received_message = data.get('message', '')
    return jsonify(message=f'Server receivedddd: {received_message}')