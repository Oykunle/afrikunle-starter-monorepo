from flask import Flask, jsonify, request
from flask_cors import CORS
import io
import traceback
import contextlib

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ---- Lessons (multi-level + i18n) ----
LESSONS = [
    {
        "id": 1,
        "level": "Beginner",
        "title": {"en": "Introduction to Python", "fr": "Introduction à Python"},
        "body": {
            "en": "Python is like Lego for the brain! It helps you build fun projects easily — websites, games, and smart tools.",
            "fr": "Python est comme des Lego pour ton cerveau ! Il t’aide à créer des projets amusants — sites web, jeux et outils intelligents."
        },
        "quiz": {
            "question": {
                "en": "Which line prints Hello World in Python?",
                "fr": "Laquelle affiche Bonjour Monde en Python ?"
            },
            "answer": 'print("Hello, World!")'
        }
    }
]

@app.get("/health")
def health():
    return jsonify({"ok": True, "service": "afrikunle-api"}), 200

@app.get("/")
def root():
    return jsonify({"status": "ok", "service": "afrikunle-api"})

@app.get("/api/lessons")
def list_lessons():
    level = request.args.get("level")
    lang = request.args.get("lang", "en")

    data = LESSONS
    if level:
        data = [l for l in LESSONS if l.get("level", "").lower() == level.lower()]

    out = []
    for l in data:
        out.append({
            "id": l["id"],
            "level": l.get("level", "Beginner"),
            "title": l["title"].get(lang, l["title"]["en"]),
            "body": l["body"].get(lang, l["body"]["en"]),
            "quiz": {
                "question": l["quiz"]["question"].get(lang, l["quiz"]["question"]["en"]),
                "answer": l["quiz"]["answer"]
            }
        })
    return jsonify(out)

@app.get("/api/lessons/<int:lid>")
def get_lesson(lid: int):
    lang = request.args.get("lang", "en")
    for l in LESSONS:
        if l["id"] == lid:
            return jsonify({
                "id": l["id"],
                "level": l.get("level", "Beginner"),
                "title": l["title"].get(lang, l["title"]["en"]),
                "body": l["body"].get(lang, l["body"]["en"]),
                "quiz": {
                    "question": l["quiz"]["question"].get(lang, l["quiz"]["question"]["en"]),
                    "answer": l["quiz"]["answer"]
                }
            })
    return jsonify({"error": "not found"}), 404

# ---- Safe Python runner ----
@app.post("/api/run")
def run_code():
    data = request.get_json() or {}
    code = data.get("code", "")

    # quick safety guard (demo-safe)
    blocked = ["import", "open(", "os.", "sys.", "eval(", "exec(", "__", "subprocess", "socket", "shutil", "requests"]
    if any(b in code for b in blocked):
        return jsonify({"output": "", "error": "⚠️ Unsafe code blocked"}), 400

    buf = io.StringIO()
    try:
        safe_builtins = {
            "print": print,
            "range": range,
            "len": len,
            "min": min,
            "max": max,
            "sum": sum
        }
        with contextlib.redirect_stdout(buf):
            exec(code, {"__builtins__": safe_builtins}, {})
        out = buf.getvalue().strip()
        return jsonify({"output": out if out else "✅ Code ran successfully!", "error": ""}), 200
    except Exception:
        err = traceback.format_exc(limit=1)
        return jsonify({"output": "", "error": f"{err}"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)