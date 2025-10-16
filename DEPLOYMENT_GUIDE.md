# Deployment Guide

This guide explains how to deploy your SQL Visualizer application with the frontend on GitHub Pages and the backend on PythonAnywhere.

## Architecture Overview

- **Frontend**: React app hosted on GitHub Pages (`https://yourusername.github.io/sql-visualizer`)
- **Backend**: Flask API hosted on PythonAnywhere (`https://yourusername.pythonanywhere.com`)
- **Communication**: Frontend makes API calls to backend via CORS-enabled endpoints

## Prerequisites

- GitHub account
- PythonAnywhere account (free tier is sufficient for development)
- Git installed locally

---

## Part 1: Deploy Backend to PythonAnywhere

### Step 1: Sign Up for PythonAnywhere

1. Go to [PythonAnywhere](https://www.pythonanywhere.com)
2. Create a free account (Beginner account is sufficient)
3. Your app will be available at `https://yourusername.pythonanywhere.com`

### Step 2: Upload Backend Files

**Option A: Using Git (Recommended)**

1. Open a Bash console on PythonAnywhere
2. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/sql-visualizer.git
   cd sql-visualizer/backend
   ```

**Option B: Manual Upload**

1. Use the Files tab to create a `sql-visualizer` directory
2. Upload all files from your `backend` folder

### Step 3: Set Up Virtual Environment

In the PythonAnywhere Bash console:

```bash
cd ~/sql-visualizer/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 4: Configure Web App

1. Go to the **Web** tab in PythonAnywhere
2. Click **Add a new web app**
3. Choose **Manual configuration** (not Flask wizard)
4. Select **Python 3.10**

### Step 5: Configure WSGI File

1. Click on the WSGI configuration file link
2. Delete the default content
3. Add the following code:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/sql-visualizer/backend'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Set up the virtual environment
activate_this = os.path.join(project_home, 'venv/bin/activate_this.py')
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

# Import your Flask app
from app import app as application
```

**Important**: Replace `yourusername` with your actual PythonAnywhere username!

### Step 6: Configure Virtual Environment Path

1. In the **Web** tab, find the **Virtualenv** section
2. Enter: `/home/yourusername/sql-visualizer/backend/venv`
3. Replace `yourusername` with your actual username

### Step 7: Configure Static Files (Optional)

If you need to serve database files directly:

1. In the **Static files** section, add:
   - URL: `/static/`
   - Directory: `/home/yourusername/sql-visualizer/backend/`

### Step 8: Reload and Test

1. Click the green **Reload** button at the top
2. Visit `https://yourusername.pythonanywhere.com/api/schema`
3. You should see JSON response with your database schema

### Troubleshooting Backend

- **Error logs**: Check the error log link on the Web tab
- **Server logs**: Check the server log link
- **Common issues**:
  - Wrong Python version selected
  - Virtual environment path incorrect
  - WSGI file has wrong username
  - Database files not uploaded

---

## Part 2: Deploy Frontend to GitHub Pages

### Step 1: Configure Your PythonAnywhere URL

1. Edit `frontend/.env.production`:
   ```env
   REACT_APP_API_URL=https://yourusername.pythonanywhere.com
   ```
   Replace `yourusername` with your actual PythonAnywhere username

2. **Alternative**: Set it as a GitHub Secret (more secure)
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click **New repository secret**
   - Name: `PYTHONANYWHERE_URL`
   - Value: `https://yourusername.pythonanywhere.com`

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### Step 3: Deploy

The GitHub Actions workflow is already configured! Simply:

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Configure for deployment"
   git push origin main
   ```

2. Go to **Actions** tab in your GitHub repository
3. Watch the "Deploy Frontend to GitHub Pages" workflow run
4. Once complete, your site will be live at:
   `https://yourusername.github.io/sql-visualizer`

### Step 4: Verify Deployment

1. Visit your GitHub Pages URL
2. Open browser DevTools (F12) → Console
3. Check for any CORS or API connection errors
4. Try running a SQL query to test the connection

### Troubleshooting Frontend

- **404 errors**: Ensure GitHub Pages is enabled and the workflow completed successfully
- **API not connecting**: 
  - Check CORS is enabled in Flask (`CORS(app)` in `app.py`)
  - Verify the API URL in `.env.production` is correct
  - Check browser console for CORS errors
- **Blank page**: Check browser console for JavaScript errors

---

## Part 3: Update and Redeploy

### Updating Backend

1. Make changes to backend code
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```
3. On PythonAnywhere:
   ```bash
   cd ~/sql-visualizer/backend
   git pull
   # If requirements changed:
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. Click **Reload** on the Web tab

### Updating Frontend

1. Make changes to frontend code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```
3. GitHub Actions will automatically build and deploy!

---

## Part 4: CORS Configuration (Important!)

Your backend must allow requests from your GitHub Pages domain. Update `backend/app.py`:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS for production
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://yourusername.github.io",
            "http://localhost:3000"  # For local development
        ]
    }
})
```

Replace `yourusername` with your GitHub username!

---

## Environment Variables Summary

### Local Development
- Frontend uses `frontend/.env.development`
- Backend runs on `localhost:5000`

### Production
- Frontend uses `frontend/.env.production` or GitHub Secret
- Backend runs on PythonAnywhere

---

## Testing Checklist

- [ ] Backend API responds at PythonAnywhere URL
- [ ] Frontend loads on GitHub Pages
- [ ] Can view database schema
- [ ] Can execute SQL queries
- [ ] No CORS errors in browser console
- [ ] Lessons mode works
- [ ] Data Detective mode works
- [ ] All visualizations render correctly

---

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [PythonAnywhere Help](https://help.pythonanywhere.com/)
- [Flask CORS Documentation](https://flask-cors.readthedocs.io/)

---

## Cost

- **GitHub Pages**: Free for public repositories
- **PythonAnywhere**: Free tier includes:
  - One web app at `yourusername.pythonanywhere.com`
  - 512MB storage
  - 100 seconds CPU time per day
  - Perfect for development and small projects!

---

## Support

If you encounter issues:

1. Check the troubleshooting sections above
2. Review browser console for errors
3. Check PythonAnywhere error logs
4. Verify all configuration files match your usernames
5. Ensure all files are properly uploaded/committed
