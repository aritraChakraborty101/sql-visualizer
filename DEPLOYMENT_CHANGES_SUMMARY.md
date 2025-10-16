# Deployment Configuration - Changes Summary

Your SQL Visualizer app is now configured to deploy the frontend on GitHub Pages and the backend on PythonAnywhere!

## ✅ What Was Changed

### Frontend Changes

1. **`frontend/package.json`**
   - Added `"homepage": "/sql-visualizer"` for GitHub Pages base path

2. **`frontend/src/config.js`** (NEW)
   - Centralized API URL configuration
   - Reads from environment variables

3. **`frontend/.env.development`** (NEW)
   - Local development API URL: `http://localhost:5000`

4. **`frontend/.env.production`** (NEW)
   - Production API URL: `https://yourusername.pythonanywhere.com`
   - ⚠️ **YOU NEED TO UPDATE THIS** with your actual PythonAnywhere username!

5. **Updated Components**
   - `App.js` - Uses API_URL from config
   - `components/DataDetective.js` - Uses API_URL from config
   - `components/LessonsSidebar.js` - Uses API_URL from config
   - `components/SchemaViewer.js` - Uses API_URL from config

### Backend Changes

6. **`backend/app.py`**
   - Enhanced CORS configuration
   - Supports both localhost (development) and GitHub Pages (production)
   - ⚠️ **RECOMMENDED**: Uncomment and add your specific GitHub Pages URL for better security

### Deployment Files (NEW)

7. **`.github/workflows/deploy-frontend.yml`**
   - GitHub Actions workflow for automatic deployment
   - Builds and deploys frontend on every push to main branch

8. **`.env.example`**
   - Template for environment variables

9. **`.gitignore`**
   - Updated to allow `.env.development` and `.env.production` files

### Documentation (NEW)

10. **`DEPLOYMENT_GUIDE.md`**
    - Comprehensive step-by-step deployment instructions
    - Covers both PythonAnywhere and GitHub Pages setup

11. **`DEPLOYMENT_QUICKSTART.md`**
    - Quick reference for deployment commands

12. **`SETUP_FOR_DEPLOYMENT.md`**
    - Explains the architecture and configuration files

## 🎯 What You Need To Do

### Before Deploying:

1. **Update Frontend Production URL**
   ```bash
   # Edit frontend/.env.production
   REACT_APP_API_URL=https://YOUR_PYTHONANYWHERE_USERNAME.pythonanywhere.com
   ```

2. **Update Backend CORS (Recommended)**
   ```python
   # Edit backend/app.py (around line 24)
   cors_origins.append("https://YOUR_GITHUB_USERNAME.github.io")
   ```

3. **Deploy Backend to PythonAnywhere**
   - Follow instructions in `DEPLOYMENT_GUIDE.md` Part 1
   - Or use `DEPLOYMENT_QUICKSTART.md` for quick commands

4. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Source: GitHub Actions

5. **Deploy Frontend**
   ```bash
   git add .
   git commit -m "Configure for deployment"
   git push origin main
   ```

## 🚀 Deployment URLs

After deployment, your app will be available at:

- **Frontend**: `https://YOUR_GITHUB_USERNAME.github.io/sql-visualizer`
- **Backend**: `https://YOUR_PYTHONANYWHERE_USERNAME.pythonanywhere.com`

## 📁 Files Structure

```
sql-visualizer/
├── frontend/
│   ├── .env.development          ← Local dev config
│   ├── .env.production           ← Production config (UPDATE THIS!)
│   ├── src/
│   │   ├── config.js             ← API URL configuration
│   │   ├── App.js                ← Updated
│   │   └── components/           ← All updated
│   └── package.json              ← Added homepage field
│
├── backend/
│   └── app.py                    ← Enhanced CORS (UPDATE THIS!)
│
├── .github/workflows/
│   └── deploy-frontend.yml       ← Auto-deployment workflow
│
├── DEPLOYMENT_GUIDE.md           ← Detailed instructions
├── DEPLOYMENT_QUICKSTART.md      ← Quick reference
└── SETUP_FOR_DEPLOYMENT.md       ← Architecture explanation
```

## 🔄 Development vs Production

### Development (Current Setup)
- Frontend: `npm start` → `http://localhost:3000`
- Backend: `python app.py` → `http://localhost:5000`
- Frontend uses `.env.development`

### Production (After Deployment)
- Frontend: GitHub Pages → `https://username.github.io/sql-visualizer`
- Backend: PythonAnywhere → `https://username.pythonanywhere.com`
- Frontend uses `.env.production`

## 🧪 Testing

Everything still works locally! Just run:

```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend  
cd frontend
npm start
```

## 📚 Next Steps

1. Read through `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Update the two configuration files mentioned above
3. Deploy backend to PythonAnywhere first
4. Then push to GitHub to deploy frontend automatically
5. Visit your live app!

## ❓ Questions?

- Detailed instructions: `DEPLOYMENT_GUIDE.md`
- Quick commands: `DEPLOYMENT_QUICKSTART.md`
- Architecture overview: `SETUP_FOR_DEPLOYMENT.md`

## 🎉 Benefits

✅ **Separate Hosting**: Frontend and backend can be deployed independently  
✅ **Free Hosting**: Both GitHub Pages and PythonAnywhere free tiers  
✅ **Auto Deployment**: Push to GitHub = automatic frontend deployment  
✅ **Same Repository**: Everything stays in one place  
✅ **Environment Separation**: Different configs for dev and production  
✅ **Easy Updates**: Simple git commands to update either part  

---

**Ready to deploy?** Start with `DEPLOYMENT_QUICKSTART.md`! 🚀
