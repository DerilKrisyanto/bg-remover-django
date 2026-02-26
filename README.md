![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![Remove.bg API](https://img.shields.io/badge/Remove.bg-Official%20API-orange)
![OpenCV](https://img.shields.io/badge/OpenCV-Image%20Processing-5C3EE8?logo=opencv&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-success)

# 🖼️ BG Remover – Django + Remove.bg API

AI-powered background remover built with **Django 5** and the official **Remove.bg API**.

Designed with:
- ✅ Session-based file isolation
- ✅ Secure file handling
- ✅ Automatic cleanup after download
- ✅ Dark / Light UI mode
- ✅ Production-ready architecture

---

# 📌 Features

- Single image processing
- Multiple image processing
- UUID-based session folders
- Automatic file cleanup
- Secure upload validation (JPG/JPEG/PNG only)
- No file overwrite
- Clean and modern UI
- Optimized for deployment

---

# 📁 Project Structure
bg_remover/
│
├── core/ # Django main project
│ ├── settings.py
│ ├── urls.py
│
├── myapp/ # Main application
│ ├── services/
│ │ └── bg_remover.py
│ ├── templates/
│ ├── static/
│ ├── views.py
│ └── urls.py
│
├── media/
│ ├── uploads/
│ └── results/
│
├── db.sqlite3
└── manage.py

---

# ⚙️ System Requirements

Before running this project, make sure you have:

- Python 3.10+
- pip
- Virtualenv (recommended)
- Remove.bg API Key

---

# 🔑 Step 1 – Get Remove.bg API Key

1. Go to: https://www.remove.bg/api
2. Create an account
3. Copy your API Key

You will need this in Step 5.

---

# 🧪 Step 2 – Clone Repository

git clone https://github.com/YOUR_USERNAME/bg-remover-django.git
cd bg-remover-django

---

# 🧰 Step 3 – Create Virtual Environment

Mac/Linux:

python3 -m venv venv
source venv/bin/activate

Windows:

python -m venv venv
venv\Scripts\activate

If successful, you will see:

(venv)

# 📦 Step 4 – Install Dependencies
Create requirements.txt:

Django==5.2.11
requests
Pillow

Then run:
pip install -r requirements.txt

# 🔐 Step 5 – Set Environment Variable (IMPORTANT)

The project requires:
REMOVE_BG_API_KEY

Mac/Linux:
export REMOVE_BG_API_KEY="your_api_key_here"

Windows (PowerShell):
setx REMOVE_BG_API_KEY "your_api_key_here"

Restart terminal after setting on Windows.

Verify:

Mac/Linux:
echo $REMOVE_BG_API_KEY

Windows:
echo $env:REMOVE_BG_API_KEY

# 🗄️ Step 6 – Apply Migrations
python manage.py migrate
This creates:
db.sqlite3
Django system tables

# 📂 Step 7 – Ensure Media Folders Exist

Make sure:
media/uploads/
media/results/

If not:

Mac/Linux:
mkdir -p media/uploads
mkdir -p media/results

Windows:
mkdir media\uploads
mkdir media\results

# 🚀 Step 8 – Run Development Server
python manage.py runserver

Open:
http://127.0.0.1:8000/
🔄 Application Flow

User uploads image

Django generates unique UUID session folder:

media/uploads/<session_id>/
media/results/<session_id>/

File sent to Remove.bg API

Processed result saved to result folder

User downloads processed image

Cleanup endpoint removes entire session folder

No leftover files

🧠 Architecture Highlights
✅ Session Isolation

Each user session has a unique UUID folder.

✅ Secure File Handling

Only JPG/JPEG/PNG allowed

UUID-based filenames

No file overwrite

✅ Auto Cleanup

After download:

/bg/cleanup/

removes all related session files.

✅ No Race Condition

Download flow uses:

fetch → blob → cleanup
📡 API Endpoints
Method	Endpoint	Description
GET	/	Main page
POST	/bg/process/	Process images
GET	/bg/download/<session>/<file>/	Download result
POST	/bg/cleanup/	Delete session files
🔎 Debug Mode

Current:

DEBUG = True

For production:

DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
🛡️ Production Deployment Notes

Recommended production stack:

Gunicorn

Nginx

PostgreSQL

Environment variables (.env)

HTTPS

DEBUG = False

Install Gunicorn:

pip install gunicorn
gunicorn core.wsgi:application
🧹 Manual Cleanup

If needed:

Mac/Linux:

rm -rf media/uploads/*
rm -rf media/results/*

Windows:

Remove-Item media\uploads\* -Recurse
Remove-Item media\results\* -Recurse
❗ Common Errors
❌ REMOVE_BG_API_KEY not set

Solution: Ensure environment variable is correctly configured.

❌ 500 Internal Server Error

Run:

python manage.py runserver

Check traceback.

❌ Image not downloading

Ensure:

Cleanup not triggered before download

Fetch blob logic intact

🧪 Pre-Production Checklist

Upload single image

Upload multiple images

Download image

Confirm folder deleted

Test invalid file type

Confirm no leftover files

📄 License

MIT License

👨‍💻 Author

Developed with Django 5 + Remove.bg Official API
