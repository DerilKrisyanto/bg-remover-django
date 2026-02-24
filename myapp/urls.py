from django.urls import path
from . import views

urlpatterns = [

    # BG Remover
    path('', views.index_bgremover),
    path('bg/process/', views.process_image),
    path('bg/download/<str:session_id>/<str:filename>/', views.download_file),
    path('bg/cleanup/', views.cleanup_files),

]