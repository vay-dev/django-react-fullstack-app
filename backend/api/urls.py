from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/<int:pk>/edit/", views.NoteUpdateView.as_view(), name="edit-note"),
    path("notes/<int:pk>/", views.NoteDetailView.as_view(), name="note-detail"),
]
