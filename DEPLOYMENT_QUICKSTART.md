# Deployment Quick Start

Quick commands to deploy your SQL Visualizer app.

## 🚀 Backend on PythonAnywhere

### One-Time Setup

```bash
# On PythonAnywhere Bash console
git clone https://github.com/yourusername/sql-visualizer.git
cd sql-visualizer/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Configure WSGI (in PythonAnywhere Web tab)

```python
import sys
project_home = '/home/yourusername/sql-visualizer/backend'
sys.path = [project_home] + sys.path

activate_this = project_home + '/venv/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

from app import app as application
```

Set Virtualenv to: `/home/yourusername/sql-visualizer/backend/venv`

Then click **Reload**.

---

## 🌐 Frontend on GitHub Pages

### One-Time Setup

1. Edit `frontend/.env.production`:
   ```env
   REACT_APP_API_URL=https://yourusername.pythonanywhere.com
   ```

2. Enable GitHub Pages:
   - Repo Settings → Pages → Source: **GitHub Actions**

3. Push to deploy:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

Your site will be live at: `https://yourusername.github.io/sql-visualizer`

---

## 🔄 Updates

### Update Backend
```bash
# On PythonAnywhere
cd ~/sql-visualizer/backend
git pull
source venv/bin/activate
pip install -r requirements.txt  # if requirements changed
# Then click Reload button on Web tab
```

### Update Frontend
```bash
# Locally
git add .
git commit -m "Update frontend"
git push origin main
# GitHub Actions deploys automatically!
```

---

## ✅ Test It

1. Backend: Visit `https://yourusername.pythonanywhere.com/api/schema`
2. Frontend: Visit `https://yourusername.github.io/sql-visualizer`
3. Try running a SQL query!

---

## 🔧 Troubleshooting

**CORS Errors?** Update `backend/app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourusername.github.io", "http://localhost:3000"]
    }
})
```

**404 on GitHub Pages?** Check Actions tab for build errors.

**Backend not working?** Check PythonAnywhere error logs in Web tab.

---

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
