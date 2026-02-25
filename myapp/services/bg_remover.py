import os
import uuid
import requests
from PIL import Image

# ========== CONFIG ========== #
REMOVE_BG_API_KEY = os.getenv("REMOVE_BG_API_KEY")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MEDIA_DIR = os.path.join(BASE_DIR, "media")

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}


# ========== SESSION BASED FOLDER ========== #
def create_user_folder():
    session_id = str(uuid.uuid4())

    upload_dir = os.path.join(MEDIA_DIR, "uploads", session_id)
    result_dir = os.path.join(MEDIA_DIR, "results", session_id)

    os.makedirs(upload_dir, exist_ok=True)
    os.makedirs(result_dir, exist_ok=True)

    return session_id, upload_dir, result_dir


# ========== REMOVE.BG OFFICIAL API CALL ========== #
def remove_bg_api(input_path, output_path):

    if not REMOVE_BG_API_KEY:
        raise ValueError("REMOVE_BG_API_KEY not set")

    with open(input_path, 'rb') as img_file:

        response = requests.post(
            "https://api.remove.bg/v1.0/removebg",
            files={"image_file": img_file},
            data={
                "size": "auto",
                "format": "png",
                "type": "auto"
            },
            headers={
                "X-Api-Key": REMOVE_BG_API_KEY
            },
            timeout=60
        )

    if response.status_code != 200:
        raise Exception(f"Remove.bg error: {response.text}")

    with open(output_path, "wb") as out:
        out.write(response.content)


# ========== MAIN PROCESS ========== #
def process_image_files(files):

    session_id, upload_dir, result_dir = create_user_folder()

    results = []

    for file in files:

        ext = file.name.split(".")[-1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise ValueError("Only JPG, JPEG, PNG allowed")

        uid = str(uuid.uuid4())

        input_name = f"{uid}.{ext}"
        input_path = os.path.join(upload_dir, input_name)

        with open(input_path, 'wb+') as f:
            for chunk in file.chunks():
                f.write(chunk)

        result_name = f"{uid}.png"
        result_path = os.path.join(result_dir, result_name)

        # OFFICIAL API CALL
        remove_bg_api(input_path, result_path)

        results.append({
            "uid": uid,
            "session_id": session_id,
            "result_name": result_name,
            "result_url": f"/media/results/{session_id}/{result_name}"
        })

    return session_id, results