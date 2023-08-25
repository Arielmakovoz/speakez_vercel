from flask import Flask, request, jsonify
#from backend import delete_this
#hiiiiiii
app = Flask(__name__)

@app.route('/api/echo', methods=['POST'])
def echo():
    data = request.json
    word = data.get('word')
    return jsonify({'echoed_word': word})