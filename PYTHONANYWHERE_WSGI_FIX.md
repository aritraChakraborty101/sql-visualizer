# PythonAnywhere WSGI Configuration Fix

## Problem
The error `FileNotFoundError: [Errno 2] No such file or directory: 'activate_this.py'` occurs because modern Python virtual environments (Python 3.3+) no longer include the `activate_this.py` file.

## Solution

### Step 1: Update Your WSGI Configuration File

On PythonAnywhere, click on the WSGI configuration file link and **replace all content** with this:

```python
# +++++++++++ FLASK +++++++++++
# Flask works with a WSGI application.
# This file contains the configuration to expose the app.

import sys
import os

# Add your project directory to the sys.path
project_home = '/home/significantbug/sql-visualizer/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables if needed
os.environ['FLASK_APP'] = 'app.py'

# Import your Flask app
from app import app as application

# For debugging (remove in production)
application.debug = False
```

**Important**: The file path is already correct: `/home/significantbug/sql-visualizer/backend`

### Step 2: Verify Virtual Environment

Make sure your virtual environment path in the Web tab is set to:
```
/home/significantbug/sql-visualizer/backend/venv
```

This is already correct based on your configuration!

### Step 3: Click Reload

After updating the WSGI file, click the green **Reload** button at the top of the Web tab.

## Why This Works

The new WSGI configuration:
- ✅ Doesn't try to activate the virtual environment using `activate_this.py`
- ✅ Uses the virtualenv path setting in the Web tab instead
- ✅ Directly adds your project to the Python path
- ✅ Imports your Flask app correctly

PythonAnywhere's uWSGI server automatically uses the virtualenv you specify in the Web tab configuration, so you don't need to manually activate it in the WSGI file.

## Testing

After reloading, visit:
```
https://significantbug.pythonanywhere.com/api/schema
```

You should see your database schema as JSON!

## What Your Logs Should Show

After the fix, you should see in the server log:
```
PEP 405 virtualenv detected: /home/significantbug/sql-visualizer/backend/venv
Set PythonHome to /home/significantbug/sql-visualizer/backend/venv
WSGI app 0 (mountpoint='') ready in 0 seconds
```

And no more FileNotFoundError!

## Additional Steps (If Still Having Issues)

### 1. Verify Files Are Uploaded

In a PythonAnywhere Bash console:
```bash
cd /home/significantbug/sql-visualizer/backend
ls -la
```

You should see:
- `app.py`
- `requirements.txt`
- `employees.db`
- `omnicorp_case.db`
- `venv/` directory

### 2. Verify Virtual Environment

```bash
cd /home/significantbug/sql-visualizer/backend
ls venv/bin/
```

You should see `python`, `pip`, `flask`, etc. (but NOT `activate_this.py` - that's normal!)

### 3. Test Import Manually

In a Bash console (not in virtualenv):
```bash
cd /home/significantbug/sql-visualizer/backend
source venv/bin/activate
python -c "from app import app; print('Import successful!')"
```

If this works, your app is ready!

### 4. Check Requirements Are Installed

```bash
cd /home/significantbug/sql-visualizer/backend
source venv/bin/activate
pip list
```

You should see:
- Flask
- Flask-CORS
- sqlglot

If missing, install:
```bash
pip install -r requirements.txt
```

## Summary

The key change is removing the old virtual environment activation code:
```python
# OLD (DOESN'T WORK) ❌
activate_this = project_home + '/venv/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))
```

And relying on PythonAnywhere's virtualenv configuration instead:
```python
# NEW (WORKS) ✅
# Just set the virtualenv path in the Web tab
# PythonAnywhere handles activation automatically
```

Your virtualenv path in the Web tab (`/home/significantbug/sql-visualizer/backend/venv`) tells PythonAnywhere which Python environment to use, so the WSGI file doesn't need to activate it manually!
