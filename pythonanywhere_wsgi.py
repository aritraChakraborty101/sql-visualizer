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
