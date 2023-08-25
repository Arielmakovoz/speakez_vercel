from flask import Flask, request, jsonify
#from backend import delete_this
#hiiiiiii
app = Flask(__name__)

def say_hello():
    return 'hello'

@app.route('/api/echo', methods=['POST'])
def echo():
    data = request.json
    word = data.get('word')
    return jsonify({'echoed_word': say_hello()})

#when I took out the backend.py from api and stutter model if worked