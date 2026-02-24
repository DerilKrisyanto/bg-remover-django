🖼️ BG Remover – Django + Remove.bg API
AI-powered background remover built with Django 5 and Remove.bg Official API.
Supports:
•	✅ Single Image
•	✅ Multiple Images
•	✅ Session-based file isolation
•	✅ Auto cleanup after download
•	✅ Dark/Light mode UI
•	✅ Production-ready architecture
________________________________________
📁 Project Structure
bg_remover/
│
├── core/                  # Django main project
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── myapp/                 # Main application
│   ├── services/
│   │   └── bg_remover.py
│   ├── templates/
│   ├── static/
│   ├── views.py
│   └── urls.py
│
├── media/
│   ├── uploads/
│   └── results/
│
├── db.sqlite3
└── manage.py
________________________________________
⚙️ System Requirements
Before running this project, make sure you have:
•	Python 3.10+
•	pip
•	Virtualenv (recommended)
•	Remove.bg API Key
________________________________________
🔑 Step 1 – Get Remove.bg API Key
1.	Go to: https://www.remove.bg/api
2.	Create an account
3.	Copy your API Key
You will need this in step 5.
________________________________________
🧪 Step 2 – Clone Repository
git clone https://github.com/YOUR_USERNAME/bg_remover.git
cd bg_remover
________________________________________
🧰 Step 3 – Create Virtual Environment
Mac/Linux
python3 -m venv venv
source venv/bin/activate
Windows
python -m venv venv
venv\Scripts\activate
If successful, you will see:
(venv)
________________________________________
📦 Step 4 – Install Dependencies
Create a file named:
requirements.txt
With this content:
Django==5.2.11
requests
Pillow
Then run:
pip install -r requirements.txt
To verify installation:
pip list
You should see:
•	Django
•	requests
•	Pillow
________________________________________
🔐 Step 5 – Set Environment Variable (IMPORTANT)
The project requires:
REMOVE_BG_API_KEY
Mac/Linux
export REMOVE_BG_API_KEY="your_api_key_here"
Windows (PowerShell)
setx REMOVE_BG_API_KEY "your_api_key_here"
Restart terminal after setting on Windows.
To verify:
echo $REMOVE_BG_API_KEY
Windows:
echo $env:REMOVE_BG_API_KEY
________________________________________
🗄️ Step 6 – Apply Migrations
python manage.py migrate
This creates:
•	db.sqlite3
•	Django system tables
________________________________________
📂 Step 7 – Ensure Media Folders Exist
Make sure these directories exist:
media/uploads/
media/results/
If not, create manually:
mkdir -p media/uploads
mkdir -p media/results
Windows:
mkdir media\uploads
mkdir media\results
________________________________________
🚀 Step 8 – Run Development Server
python manage.py runserver
You should see:
Starting development server at http://127.0.0.1:8000/
Open in browser:
http://127.0.0.1:8000/
________________________________________
🔄 Application Flow
1.	User uploads image
2.	Django creates unique session folder:
media/uploads/<session_id>/
media/results/<session_id>/
3.	File sent to Remove.bg API
4.	Result stored in session result folder
5.	User downloads image
6.	After download:
o	uploads folder deleted
o	results folder deleted
7.	No leftover files
________________________________________
🧠 Key Architecture Features
✅ Session Isolation
Each user gets unique UUID-based folder.
✅ Secure File Handling
•	Only JPG/JPEG/PNG allowed
•	UUID file naming
•	No file overwrite
✅ Auto Cleanup
After download:
/bg/cleanup/
removes entire session folder.
✅ No Race Condition
Download uses:
fetch → blob → cleanup
________________________________________
📡 API Endpoints
Method	Endpoint	Description
GET	/	Main page
POST	/bg/process/	Process images
GET	/bg/download/<session>/<file>/	Download result
POST	/bg/cleanup/	Delete session files
________________________________________
🔎 Debug Mode
Currently in:
DEBUG = True
For production:
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
________________________________________
🛡️ Production Deployment Notes
For real production:
•	Use Gunicorn
•	Use Nginx
•	Use PostgreSQL
•	Use environment variables (.env)
•	Use HTTPS
•	Disable DEBUG
Example production install:
pip install gunicorn
gunicorn core.wsgi:application
________________________________________
🧹 Cleanup Safety
Even if user closes browser:
Session folders can be safely cleaned manually:
rm -rf media/uploads/*
rm -rf media/results/*
________________________________________
❗ Common Errors
❌ REMOVE_BG_API_KEY not set
Solution:
Set environment variable properly.
________________________________________
❌ 500 Internal Server Error
Check:
python manage.py runserver
for detailed traceback.
________________________________________
❌ Image not downloading
Ensure:
•	cleanup not triggered before download
•	fetch blob logic intact
________________________________________
🧪 Test Scenario Checklist
Before pushing to production:
•	Upload single image
•	Upload multiple images
•	Download image
•	Confirm folder deleted
•	Click Process Another
•	Confirm folder deleted
•	Test invalid file type
________________________________________
📄 License
MIT License
________________________________________
👨‍💻 Author
Developed with Django 5 + Remove.bg API

