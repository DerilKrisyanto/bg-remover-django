from django.shortcuts import render
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views.decorators.http import require_GET

from .services.bg_remover import process_image_files

import json
import os
import threading
import time
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESULT_DIR = os.path.join(BASE_DIR, "media/results")
UPLOAD_DIR = os.path.join(BASE_DIR, "media/uploads")

# ==========================================================
# BG REMOVER
# ==========================================================

def index_bgremover(request):
    return render(request, "bg_remover.html")


@csrf_exempt
def process_image(request):

    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    files = request.FILES.getlist("files")
    if not files:
        return JsonResponse({"error": "No files uploaded"}, status=400)

    try:
        session_id, results = process_image_files(files)

        return JsonResponse({
            "session_id": session_id,
            "results": results
        })

    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)


@require_GET
def download_file(request, session_id, filename):

    result_dir = os.path.join(RESULT_DIR, session_id)
    file_path = os.path.join(result_dir, filename)

    if not os.path.exists(file_path):
        raise Http404("File not found")

    return FileResponse(
        open(file_path, "rb"),
        as_attachment=True,
        filename="Bg_Remover_by_mediaTools.png"
    )


@csrf_exempt
@require_POST
def cleanup_files(request):

    try:
        data = json.loads(request.body)
        session_id = data.get("session_id")

        if not session_id:
            return JsonResponse({"error": "No session"}, status=400)

        upload_dir = os.path.join(UPLOAD_DIR, session_id)
        result_dir = os.path.join(RESULT_DIR, session_id)

        if os.path.exists(upload_dir):
            shutil.rmtree(upload_dir, ignore_errors=True)

        if os.path.exists(result_dir):
            shutil.rmtree(result_dir, ignore_errors=True)

        return JsonResponse({"status": "deleted"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)