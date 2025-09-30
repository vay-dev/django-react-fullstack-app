# Backend Changes Required

## 1. Update Note Model

Add these fields to your `Note` model in `backend/api/models.py`:

```python
from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    # Existing fields
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')

    # NEW FIELDS - Add these
    category = models.CharField(max_length=100, blank=True, null=True)
    color = models.CharField(max_length=20, default='pink')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
```

## 2. Update Serializer

Update your `NoteSerializer` in `backend/api/serializers.py`:

```python
from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'category', 'color',
                  'created_at', 'updated_at', 'author']
        read_only_fields = ['author', 'created_at', 'updated_at']
```

## 3. Update Views

Make sure your views support these operations in `backend/api/views.py`:

```python
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from .serializers import NoteSerializer

# List all notes for authenticated user
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# Get single note
class NoteDetail(generics.RetrieveAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

# Update note (PUT)
class NoteUpdate(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

# Delete note
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)
```

## 4. Update URLs

Update your `backend/api/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    # Note operations
    path('notes/', views.NoteListCreate.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', views.NoteDetail.as_view(), name='note-detail'),
    path('notes/<int:pk>/', views.NoteUpdate.as_view(), name='note-update'),  # PUT
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='note-delete'),
]
```

## 5. Run Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## 6. Test Endpoints

Make sure these endpoints work:

- ✅ `GET /api/notes/` - List all notes
- ✅ `POST /api/notes/` - Create note
- ✅ `GET /api/notes/{id}/` - Get single note
- ✅ `PUT /api/notes/{id}/` - Update note (THIS IS NEW - make sure it works!)
- ✅ `DELETE /api/notes/delete/{id}/` - Delete note

## 7. Test with Postman or cURL

### Create Note with Category and Color
```bash
curl -X POST http://localhost:8000/api/notes/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Note",
    "content": "Note content here",
    "category": "Work",
    "color": "red"
  }'
```

### Update Note
```bash
curl -X PUT http://localhost:8000/api/notes/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content",
    "category": "Fitness",
    "color": "green"
  }'
```

## Common Issues & Solutions

### Issue: Migrations conflict
**Solution:**
```bash
python manage.py migrate --fake api zero
python manage.py migrate api
```

### Issue: PUT endpoint returns 405 Method Not Allowed
**Solution:** Make sure you're using `UpdateAPIView` or `RetrieveUpdateAPIView` for the detail route

### Issue: Category/Color not saving
**Solution:** Check that fields are in serializer's `fields` list and NOT in `read_only_fields`

---

## That's It!

Once you complete these backend changes, your frontend will work perfectly with all the new features:
- ✅ Colored notes
- ✅ Category filtering
- ✅ Note editing
- ✅ Search functionality
- ✅ Responsive UI