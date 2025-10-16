# 🚀 Deployment Checklist

Use this checklist to deploy your SQL Visualizer app step by step.

## 📋 Pre-Deployment Setup

- [ ] Create a PythonAnywhere account at https://www.pythonanywhere.com
- [ ] Create a GitHub account (if you don't have one)
- [ ] Push your code to GitHub repository

## ⚙️ Configuration

### Backend Configuration

- [ ] Open `backend/app.py`
- [ ] Find line ~24: `cors_origins.append("https://YOUR_USERNAME.github.io")`
- [ ] Replace `YOUR_USERNAME` with your GitHub username
- [ ] Save the file

### Frontend Configuration

- [ ] Open `frontend/.env.production`
- [ ] Replace `yourusername` with your PythonAnywhere username
- [ ] Result should look like: `REACT_APP_API_URL=https://YOUR_USERNAME.pythonanywhere.com`
- [ ] Save the file

### Commit Configuration

- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Configure for deployment"`
- [ ] Run: `git push origin main`

## 🐍 Backend Deployment (PythonAnywhere)

### Setup

- [ ] Log into PythonAnywhere
- [ ] Open a Bash console
- [ ] Run: `git clone https://github.com/YOUR_USERNAME/sql-visualizer.git`
- [ ] Run: `cd sql-visualizer/backend`
- [ ] Run: `python3.10 -m venv venv`
- [ ] Run: `source venv/bin/activate`
- [ ] Run: `pip install -r requirements.txt`

### Web App Configuration

- [ ] Go to **Web** tab in PythonAnywhere
- [ ] Click **Add a new web app**
- [ ] Choose **Manual configuration**
- [ ] Select **Python 3.10**

### WSGI Configuration

- [ ] Click on the WSGI configuration file link
- [ ] Delete all existing content
- [ ] Copy and paste this code (replace `yourusername` with yours):

```python
import sys
project_home = '/home/yourusername/sql-visualizer/backend'
sys.path = [project_home] + sys.path

activate_this = project_home + '/venv/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

from app import app as application
```

- [ ] Save the file

### Virtual Environment Path

- [ ] In the **Web** tab, find **Virtualenv** section
- [ ] Enter: `/home/yourusername/sql-visualizer/backend/venv`
- [ ] Replace `yourusername` with your actual username

### Reload and Test

- [ ] Click the green **Reload** button
- [ ] Visit: `https://yourusername.pythonanywhere.com/api/schema`
- [ ] You should see JSON data (database schema)
- [ ] ✅ If you see JSON, backend is working!
- [ ] ❌ If you see an error, check the error log in the Web tab

## 🌐 Frontend Deployment (GitHub Pages)

### Enable GitHub Pages

- [ ] Go to your repository on GitHub
- [ ] Click **Settings**
- [ ] Click **Pages** in the left sidebar
- [ ] Under **Source**, select **GitHub Actions**

### Trigger Deployment

- [ ] Your code should already be pushed from the configuration step
- [ ] Go to the **Actions** tab in your repository
- [ ] You should see "Deploy Frontend to GitHub Pages" workflow running
- [ ] Wait for it to complete (green checkmark)
- [ ] ✅ If successful, your site is live!
- [ ] ❌ If failed, click on the workflow to see error details

### Test Your App

- [ ] Visit: `https://YOUR_USERNAME.github.io/sql-visualizer`
- [ ] The app should load
- [ ] Open browser DevTools (F12) → Console tab
- [ ] Check for any errors
- [ ] Try running a SQL query like: `SELECT * FROM employees LIMIT 5`
- [ ] You should see results!

## 🧪 Full Integration Test

- [ ] Visit your frontend URL
- [ ] Click on **Schema** to view database tables
- [ ] Run a query: `SELECT * FROM employees WHERE salary > 60000`
- [ ] Check that results display correctly
- [ ] Try **Lesson Mode** (if you have lessons)
- [ ] Try **Data Detective** mode (if enabled)
- [ ] Check browser console for any errors
- [ ] ✅ Everything works? Congratulations! 🎉

## 🔄 Future Updates

### Update Backend

- [ ] Make changes to backend code locally
- [ ] Push to GitHub: `git push origin main`
- [ ] Log into PythonAnywhere Bash console
- [ ] Run: `cd ~/sql-visualizer/backend`
- [ ] Run: `git pull`
- [ ] If requirements.txt changed: `source venv/bin/activate && pip install -r requirements.txt`
- [ ] Go to Web tab and click **Reload**

### Update Frontend

- [ ] Make changes to frontend code locally
- [ ] Push to GitHub: `git push origin main`
- [ ] GitHub Actions will automatically rebuild and deploy!
- [ ] Wait 2-3 minutes, then refresh your site

## ❓ Troubleshooting

### Backend Issues

- [ ] **Error 500**: Check error logs in PythonAnywhere Web tab
- [ ] **Database not found**: Ensure `.db` files are uploaded to backend folder
- [ ] **WSGI errors**: Double-check username in WSGI file matches yours
- [ ] **Virtual env not found**: Verify virtual environment path is correct

### Frontend Issues

- [ ] **404 Error**: Verify GitHub Pages is enabled and workflow succeeded
- [ ] **Blank page**: Check browser console for JavaScript errors
- [ ] **API not connecting**: 
  - Verify `.env.production` has correct PythonAnywhere URL
  - Check CORS configuration in `backend/app.py`
  - Open browser console and look for CORS errors

### CORS Errors

- [ ] Verify `backend/app.py` includes your GitHub Pages URL
- [ ] Ensure the URL format is correct (no trailing slash)
- [ ] Click **Reload** on PythonAnywhere Web tab after changing CORS
- [ ] Clear browser cache and try again

## 📝 Important URLs to Save

- **Frontend**: `https://YOUR_GITHUB_USERNAME.github.io/sql-visualizer`
- **Backend**: `https://YOUR_PYTHONANYWHERE_USERNAME.pythonanywhere.com`
- **PythonAnywhere Dashboard**: https://www.pythonanywhere.com/dashboard/
- **GitHub Actions**: `https://github.com/YOUR_USERNAME/sql-visualizer/actions`

## 🎓 Resources

- [ ] Bookmark: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed guide
- [ ] Bookmark: [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md) - Quick commands
- [ ] Bookmark: [GitHub Pages Docs](https://docs.github.com/en/pages)
- [ ] Bookmark: [PythonAnywhere Help](https://help.pythonanywhere.com/)

---

## ✅ Deployment Complete!

Once all checkboxes are checked, your app is live and accessible to anyone with the URL!

Share it with friends, add it to your portfolio, and keep building! 🚀

---

**Need help?** Review the detailed guides or check PythonAnywhere/GitHub documentation.
