from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import contextlib

app = Flask(__name__)
CORS(app)

@app.route('/api/run', methods=['POST', 'OPTIONS'])
def run_code():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response, 200

    data = request.get_json()
    code = data.get("code", "")

    # Create a safe environment for exec()
    safe_globals = {}
    safe_locals = {}

    # Capture stdout output
    stdout_buffer = io.StringIO()
    try:
        with contextlib.redirect_stdout(stdout_buffer):
            exec(code, safe_globals, safe_locals)
        output = stdout_buffer.getvalue().strip() or "✅ Code ran successfully!"
        return jsonify({"output": output}), 200
    except Exception as e:
        return jsonify({"output": f"⚠️ Error: {str(e)}"}), 200

@app.route('/')
def home():
    return jsonify({"message": "Afrikunle Flask API is running ✅"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)