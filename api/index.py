from flask import Flask, request, jsonify
#from backend import speech_fluency
#hiiiiiii
app = Flask(__name__)

@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    word = data.get('word')
    return jsonify({'echoed_word': word})