# 🏗️ Deployment Architecture

Visual guide to understand how your app is deployed across two platforms.

## 🌐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR REPOSITORY                          │
│                  github.com/username/sql-visualizer              │
│                                                                   │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │      frontend/       │      │      backend/        │        │
│  │  - React App         │      │  - Flask API         │        │
│  │  - src/components/   │      │  - app.py            │        │
│  │  - package.json      │      │  - *.db files        │        │
│  │  - .env files        │      │  - requirements.txt  │        │
│  └──────────────────────┘      └──────────────────────┘        │
│           │                              │                       │
│           │ (GitHub Actions)             │ (git pull)           │
│           │                              │                       │
└───────────┼──────────────────────────────┼───────────────────────┘
            │                              │
            ▼                              ▼
┌──────────────────────┐      ┌──────────────────────────┐
│   GitHub Pages       │      │    PythonAnywhere        │
│                      │      │                          │
│  🌍 Frontend Host    │◄─────┤  🐍 Backend Host         │
│                      │ CORS │                          │
│  Static HTML/CSS/JS  │      │  Python/Flask API        │
│                      │      │  SQLite Databases        │
│  Auto-deploys on     │      │  Manual reload needed    │
│  git push            │      │  after updates           │
└──────────────────────┘      └──────────────────────────┘
            │                              ▲
            │                              │
            │         API Requests         │
            └──────────────────────────────┘
                   (fetch calls)

         User visits:                    Frontend calls:
 username.github.io/sql-visualizer → username.pythonanywhere.com/api/*
```

## 📊 Data Flow

### 1. User Visits Frontend

```
User Browser
    │
    ├─► Requests: https://username.github.io/sql-visualizer
    │
    └─► GitHub Pages serves:
        - HTML (index.html)
        - CSS (styles)
        - JavaScript (React app bundle)
```

### 2. App Loads and Connects to Backend

```
React App (in Browser)
    │
    ├─► config.js reads: process.env.REACT_APP_API_URL
    │   └─► Value: https://username.pythonanywhere.com
    │
    ├─► Components use API_URL:
    │   - App.js
    │   - DataDetective.js
    │   - LessonsSidebar.js
    │   - SchemaViewer.js
    │
    └─► Makes fetch() calls to backend
```

### 3. Backend Processes Requests

```
PythonAnywhere
    │
    ├─► Receives: https://username.pythonanywhere.com/api/query
    │
    ├─► CORS Check:
    │   - Is origin allowed? (github.io)
    │   - If yes, continue
    │   - If no, reject (CORS error)
    │
    ├─► Flask processes request:
    │   - Parse SQL query
    │   - Execute on SQLite database
    │   - Generate visualization steps
    │   - Prepare response
    │
    └─► Sends JSON response back
```

### 4. Frontend Displays Results

```
React App
    │
    ├─► Receives JSON from backend
    │
    ├─► Updates state:
    │   - Results table
    │   - Visualization steps
    │   - Tips and complexity
    │
    └─► Renders to user
```

## 🔐 Security & CORS

```
Browser Security Policy:
┌──────────────────────────────────────────────────────┐
│ "Can username.github.io make requests to             │
│  username.pythonanywhere.com?"                       │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
        Check CORS Headers
                    │
        ┌───────────┴───────────┐
        │                       │
    ❌ NO                     ✅ YES
  (blocked)              (allowed)
        │                       │
Backend didn't        Backend sent:
include github.io     Access-Control-Allow-Origin:
in cors_origins       https://username.github.io
```

## 🔄 Update Process

### Frontend Updates

```
Local Machine                GitHub              GitHub Pages
     │                         │                      │
     ├──► git push ────────────►│                      │
     │                         │                      │
     │                         ├──► GitHub Actions    │
     │                         │    triggers          │
     │                         │                      │
     │                         ├──► npm ci            │
     │                         ├──► npm run build     │
     │                         ├──► deploy            │
     │                         │                      │
     │                         └─────────────────────►│
     │                                                │
     └──► User sees changes in 2-3 minutes ──────────┘
```

### Backend Updates

```
Local Machine          GitHub          PythonAnywhere
     │                   │                   │
     ├──► git push ──────►│                   │
     │                   │                   │
     │                   │   ┌───────────────┤
     │                   │   │ SSH/Console   │
     │                   │   │               │
     │                   │   ├──► git pull   │
     │                   │   ├──► pip install│
     │                   │   │    (if needed) │
     │                   │   │               │
     │                   │   └──► Click      │
     │                   │        Reload     │
     │                   │        Button     │
     │                   │                   │
     └──► User sees changes immediately ────┘
```

## 💾 Database Hosting

```
PythonAnywhere File System
/home/username/sql-visualizer/backend/
    │
    ├── employees.db          ← Main database
    ├── omnicorp_case.db      ← Detective mode database
    │
    └── app.py connects to these local SQLite files
        │
        └── No external database server needed!
```

## 🌍 Environment Variables

### Development (Local)

```
frontend/.env.development
    │
    └─► REACT_APP_API_URL=http://localhost:5000
            │
            └─► Used when: npm start
```

### Production (Deployed)

```
frontend/.env.production
    │
    └─► REACT_APP_API_URL=https://username.pythonanywhere.com
            │
            └─► Used when: npm run build (on GitHub Actions)
```

## 📦 What Gets Deployed Where

### GitHub Pages (Frontend Only)

```
Deploys from: frontend/build/
    │
    ├── index.html
    ├── static/
    │   ├── css/
    │   ├── js/
    │   └── media/
    └── manifest.json

Backend files are NOT deployed here!
```

### PythonAnywhere (Backend Only)

```
Deploys: backend/
    │
    ├── app.py
    ├── linter.py
    ├── requirements.txt
    ├── *.db files
    ├── *.json files
    └── venv/

Frontend files are NOT deployed here!
```

## 🎯 Summary

| Aspect          | Frontend (GitHub Pages)      | Backend (PythonAnywhere)     |
|-----------------|------------------------------|------------------------------|
| **Technology**  | React (Static)               | Flask (Dynamic)              |
| **URL**         | github.io/sql-visualizer     | pythonanywhere.com           |
| **Deployment**  | Automatic (Git push)         | Manual (Git pull + Reload)   |
| **Files**       | HTML, CSS, JS                | Python, SQLite DBs           |
| **Updates**     | 2-3 minutes                  | Instant after reload         |
| **Cost**        | Free (public repo)           | Free (basic tier)            |
| **Data**        | No database                  | SQLite databases             |

## 🚀 Benefits of This Architecture

✅ **Separation of Concerns**: Frontend and backend are independent  
✅ **Free Hosting**: Both platforms offer free tiers  
✅ **Easy Updates**: Push to deploy (frontend) or pull and reload (backend)  
✅ **Scalable**: Can upgrade either side independently  
✅ **No Server Management**: Platforms handle infrastructure  
✅ **Same Repository**: Everything in one place for easy development  

---

**Ready to deploy?** Follow the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)! ✅
