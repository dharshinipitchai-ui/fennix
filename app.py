# Flask-ready backend: serves the site and the JSON FAQ.  Run: pip install flask && python app.py
import json
from flask import Flask, jsonify, send_from_directory
app = Flask(__name__, static_folder=".", static_url_path="")

@app.route("/")
def home(): return send_from_directory(".", "index.html")

@app.route("/api/faq")
def faq():
    with open("data/faq.json", encoding="utf-8") as f: return jsonify(json.load(f))

if __name__ == "__main__": app.run(debug=True)
