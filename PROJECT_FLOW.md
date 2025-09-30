# Django-React Notes App - Project Flow Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Page Flow](#page-flow)
4. [Component Hierarchy](#component-hierarchy)
5. [API Endpoints](#api-endpoints)
6. [Backend Requirements](#backend-requirements)
7. [Styling System](#styling-system)
8. [Color Logic](#color-logic)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Login    │  │  Register  │  │  Not Found │       │
│  └────────────┘  └────────────┘  └────────────┘       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Protected Routes (Auth Required)        │    │
│  │                                                 │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │    │
│  │  │   Home   │  │  Search  │  │ NoteView │    │    │
│  │  └──────────┘  └──────────┘  └──────────┘    │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────┐         │    │
│  │  │        NoteEditor                │         │    │
│  │  │  (Create & Edit)                 │         │    │
│  │  └──────────────────────────────────┘         │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          │
                          │ API Calls (axios)
                          │
┌─────────────────────────▼─────────────────────────────────┐
│                   BACKEND (Django)                        │
│                                                            │
│  ┌─────────────────────────────────────────────────┐     │
│  │              API Endpoints                       │     │
│  │  • POST   /api/token/                           │     │
│  │  • POST   /api/token/refresh/                   │     │
│  │  • POST   /api/user/register/                   │     │
│  │  • GET    /api/notes/                           │     │
│  │  • POST   /api/notes/                           │     │
│  │  • GET    /api/notes/{id}/                      │     │
│  │  • PUT    /api/notes/{id}/                      │     │
│  │  • DELETE /api/notes/delete/{id}/               │     │
│  └─────────────────────────────────────────────────┘     │
│                          │                                 │
│                          ▼                                 │
│  ┌─────────────────────────────────────────────────┐     │
│  │              Database (SQLite)                   │     │
│  │  • User Model                                    │     │
│  │  • Note Model                                    │     │
│  └─────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘
```

---

## File Structure

```
django-react-fullstack-app/
│
├── frontend/
│   ├── public/
│   │   └── images/
│   │       ├── empty-notes.svg        (Add from Figma)
│   │       └── search-empty.svg       (Add from Figma)
│   │
│   └── src/
│       ├── api.js                     ✅ Axios instance
│       ├── constants.js               ✅ Token constants
│       ├── App.jsx                    ✅ Main app with routes
│       ├── main.jsx                   ✅ Entry point
│       │
│       ├── components/
│       │   ├── notes.jsx              ✅ Note card component
│       │   ├── protectedRoute.jsx     ✅ Auth wrapper
│       │   ├── loadingindicator.jsx   ✅ Loading spinner
│       │   └── form.jsx               ✅ Auth form
│       │
│       ├── pages/
│       │   ├── home.jsx               ✅ Home page (notes grid)
│       │   ├── note-view.jsx          ✅ View single note
│       │   ├── note-editor.jsx        ✅ Create/edit note
│       │   ├── search.jsx             ✅ Search & filter notes
│       │   ├── login.jsx              ✅ Login page
│       │   ├── register.jsx           ✅ Register page
│       │   └── not-found.jsx          ✅ 404 page
│       │
│       ├── utils/
│       │   └── noteColors.js          ✅ Color assignment logic
│       │
│       └── styles/
│           ├── main.scss              ✅ Main SCSS entry
│           └── scss/
│               ├── _variables.scss    ✅ Colors, spacing, etc.
│               ├── _mixins.scss       ✅ Reusable mixins
│               ├── _base.scss         ✅ Base styles
│               ├── components/
│               │   └── _note-card.scss ✅ Note card styles
│               └── pages/
│                   ├── _home.scss      ✅ Home page styles
│                   ├── _note-view.scss ✅ View page styles
│                   ├── _note-editor.scss ✅ Editor styles
│                   └── _search.scss    ✅ Search page styles
│
└── backend/
    └── (Your Django setup)
```

---

## Page Flow

### 1. **Authentication Flow**

```
┌─────────┐
│ Start   │
└────┬────┘
     │
     ▼
┌─────────────┐      No Token      ┌──────────┐
│   Check     ├───────────────────►│  Login   │
│   Token     │                     └─────┬────┘
└─────┬───────┘                           │
      │                                   │
      │ Valid Token                       │ Login Success
      │                                   │
      ▼                                   ▼
┌─────────────┐                     Store Token
│    Home     │◄────────────────────────┘
│   Page      │
└─────────────┘
```

### 2. **Main User Flow**

```
┌──────────────────────────────────────────────────────┐
│                    HOME PAGE                         │
│  • View all notes in grid                            │
│  • Click note → View                                 │
│  • Search button → Search page                       │
│  • New Note button → Editor                          │
│  • Logout button → Login                             │
└──────────────────────────────────────────────────────┘
           │              │               │
           │              │               │
   ┌───────┘              │               └──────┐
   │                      │                      │
   ▼                      ▼                      ▼
┌────────┐         ┌──────────┐         ┌──────────┐
│ Search │         │ NoteView │         │  Editor  │
│  Page  │         │   Page   │         │   Page   │
└────────┘         └─────┬────┘         └──────────┘
   │                     │                     │
   │                     │                     │
   │              ┌──────┴──────┐             │
   │              │             │             │
   │              ▼             ▼             │
   │         ┌────────┐   ┌─────────┐        │
   │         │  Edit  │   │ Delete  │        │
   │         │  Note  │   │  Note   │        │
   │         └───┬────┘   └────┬────┘        │
   │             │             │             │
   └─────────────┴─────────────┴─────────────┘
                 │
                 ▼
           ┌──────────┐
           │   HOME   │
           └──────────┘
```

### 3. **Note Creation/Editing Flow**

```
┌──────────────┐
│   Editor     │
│   Page       │
└──────┬───────┘
       │
       ├─► Select Title
       ├─► Select Category (Optional)
       ├─► Select Color
       ├─► Write Content
       │
       ▼
┌──────────────┐      Validation     ┌───────────┐
│   Click      ├─────────────────────►  API Call │
│   Save       │      Success         └─────┬─────┘
└──────────────┘                            │
                                            ▼
                                    ┌───────────────┐
                                    │  Redirect to  │
                                    │  Home or View │
                                    └───────────────┘
```

---

## Component Hierarchy

```
App.jsx
├── Routes
    ├── Login (Public)
    ├── Register (Public)
    ├── Protected Routes
    │   ├── Home
    │   │   └── Note (Component) × N
    │   ├── NoteView
    │   ├── NoteEditor
    │   └── SearchPage
    │       └── Note (Component) × N
    └── NotFound (Public)
```

---

## API Endpoints

### Backend Requirements

You need to create/ensure these endpoints exist in your Django backend:

#### **Authentication Endpoints**
```
POST   /api/token/                    - Login (get JWT tokens)
POST   /api/token/refresh/            - Refresh access token
POST   /api/user/register/            - Register new user
```

#### **Notes Endpoints**
```
GET    /api/notes/                    - List all user's notes
POST   /api/notes/                    - Create new note
GET    /api/notes/{id}/               - Get single note
PUT    /api/notes/{id}/               - Update note
DELETE /api/notes/delete/{id}/        - Delete note
```

### Note Model Fields Required

Your Django Note model should have these fields:

```python
class Note(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=100, blank=True, null=True)  # NEW
    color = models.CharField(max_length=20, default='pink')             # NEW
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)                    # NEW
    author = models.ForeignKey(User, on_delete=models.CASCADE)
```

### Serializer Update Needed

```python
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'category', 'color',
                  'created_at', 'updated_at', 'author']
        read_only_fields = ['author', 'created_at', 'updated_at']
```

---

## Styling System

### SASS Architecture

The project uses a modular SASS architecture with:

- **Variables** (`_variables.scss`): Colors, spacing, typography, breakpoints
- **Mixins** (`_mixins.scss`): Reusable functions for responsive design
- **Base** (`_base.scss`): Global styles and resets
- **Components**: Scoped component styles
- **Pages**: Page-specific styles

### Responsive Breakpoints

```scss
$mobile: 320px;    // Mobile devices
$tablet: 768px;    // Tablets
$desktop: 1024px;  // Desktops
$wide: 1440px;     // Wide screens
```

### Grid Layouts

**Home Page Grid:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Wide: 4 columns

---

## Color Logic

### Note Color Assignment

Each note gets a color based on:

1. **Priority 1**: Custom color stored in database (`note.color`)
2. **Priority 2**: Category mapping:
   - Book Review → Pink
   - Work → Red
   - Fitness → Green
   - Budget → Yellow
   - Learning → Blue
   - Ideas → Purple
3. **Priority 3**: Index-based cycling (fallback)

### Color Palette

```javascript
{
  pink:   '#FFC0CB',
  red:    '#FF4444',
  green:  '#90EE90',
  yellow: '#FFD700',
  blue:   '#87CEEB',
  purple: '#DDA0DD'
}
```

---

## Key Features

### ✅ Implemented
- SASS modular architecture
- Responsive design (mobile, tablet, desktop, wide)
- Color-coded notes with category support
- Full CRUD operations
- Search and filter functionality
- Protected routes with JWT authentication
- Modern UI with card-based design

### 🔄 To Be Implemented (Future)
- Dark mode toggle
- Note sharing
- Rich text editor
- Image attachments
- Tags system
- Export to PDF/Markdown

---

## Running the App

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

---

## Images to Add

Place these in `frontend/public/images/`:

1. **empty-notes.svg** - Empty state for home page
2. **search-empty.svg** - Empty state for search results

Export these from your Figma design.

---

## Notes for Development

1. **Remember to update Django models** with `category`, `color`, and `updated_at` fields
2. **Create migrations** after updating models
3. **Update serializers** to include new fields
4. **Ensure PUT endpoint exists** for note editing
5. **Add empty state images** to `/public/images/`

---

**End of Documentation**

Generated: ${new Date().toLocaleDateString()}
Version: 1.0.0