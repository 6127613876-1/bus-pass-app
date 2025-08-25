# server.py
import os
import base64
import json
import requests
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

CLIENT_ID = os.getenv("GOOGLE_DRIVE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_DRIVE_CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("GOOGLE_DRIVE_REFRESH_TOKEN")
FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID")

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)


def get_access_token(refresh_token: str):
    """Exchange refresh token for access token."""
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }
    r = requests.post(token_url, data=data)
    tokens = r.json()
    if "access_token" not in tokens:
        print("Error fetching access token:", tokens)
    return tokens.get("access_token")


@app.route("/api/upload/google-drive", methods=["POST"])
def upload_to_google_drive():
    """Upload a file to Google Drive inside the given folder."""
    req = request.get_json()
    file_name = req.get("fileName")
    file_data = req.get("fileData")  # base64 encoded string

    if not file_name or not file_data:
        return jsonify({"error": "Missing fileName or fileData"}), 400

    # Get access token from refresh token
    access_token = get_access_token(REFRESH_TOKEN)
    if not access_token:
        return jsonify({"error": "Could not get access token"}), 500

    metadata = {"name": file_name, "parents": [FOLDER_ID]}
    files = {
        "metadata": ("metadata", json.dumps(metadata), "application/json"),
        "file": (file_name, base64.b64decode(file_data)),
    }

    upload_url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.post(upload_url, files=files, headers=headers)

    print("Upload response:", response.status_code, response.text)

    if response.status_code not in [200, 201]:
        return jsonify({"error": "Google Drive upload failed", "details": response.text}), 500

    file_id = response.json().get("id")

    # Make file public
    perm_url = f"https://www.googleapis.com/drive/v3/files/{file_id}/permissions"
    perm_data = {"role": "reader", "type": "anyone"}
    perm_headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    perm_res = requests.post(perm_url, json=perm_data, headers=perm_headers)

    print("Permission response:", perm_res.status_code, perm_res.text)

    if perm_res.status_code not in [200, 201]:
        return jsonify({"error": "Failed to set file permission", "details": perm_res.text}), 500

    # Public direct link
    direct_link = f"https://drive.google.com/uc?id={file_id}&export=download"
    return jsonify({"url": direct_link})


@app.route("/api/image-proxy")
def image_proxy():
    """Proxy for fetching images from Google Drive to avoid CORS issues."""
    file_url = request.args.get("url")
    if not file_url:
        return jsonify({"error": "Missing url parameter"}), 400

    try:
        # The client is already creating the direct download link
        response = requests.get(file_url, stream=True)
        response.raise_for_status()

        # Get the content type from the original response
        content_type = response.headers.get("Content-Type", "application/octet-stream")

        # Stream the response back to the client
        return Response(response.iter_content(chunk_size=8192), content_type=content_type)

    except requests.exceptions.RequestException as e:
        # Log the error for debugging
        print(f"Error proxying image: {e}")
        return jsonify({"error": "Failed to fetch image"}), 502 # 502 Bad Gateway is appropriate here


if __name__ == "__main__":
    app.run(port=5000, debug=True)
