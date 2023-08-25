from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    word = data.get('word')
    return jsonify({'echoed_word': word})