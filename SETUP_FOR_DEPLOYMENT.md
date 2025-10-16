# Setup for Deployment

This document explains the deployment architecture and the files that have been configured.

## 📁 Project Structure for Deployment

```
sql-visualizer/
├── backend/                          # Flask API (PythonAnywhere)
│   ├── app.py                       # Backend with CORS configured
│   ├── requirements.txt             # Python dependencies
│   └── *.db                         # SQLite databases
│
├── frontend/                         # React App (GitHub Pages)
│   ├── src/
│   │   ├── config.js               # API URL configuration
│   │   ├── App.js                  # Updated to use config
│   │   └── components/             # All updated to use config
│   ├── .env.development            # Local dev API URL
│   ├── .env.production             # Production API URL
│   └── package.json                # Updated with homepage field
│
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml     # GitHub Actions workflow
│
├── .env.example                     # Environment variables template
├── DEPLOYMENT_GUIDE.md              # Detailed deployment instructions
└── DEPLOYMENT_QUICKSTART.md         # Quick reference guide
```

## 🔧 Configuration Files

### 1. Frontend Configuration

#### `frontend/package.json`
- Added `"homepage": "/sql-visualizer"` for GitHub Pages base path

#### `frontend/src/config.js`
- Centralized API URL configuration
- Uses environment variables: `process.env.REACT_APP_API_URL`

#### `frontend/.env.development`
- Local development: `http://localhost:5000`

#### `frontend/.env.production`
- Production: Your PythonAnywhere URL
- **Action Required**: Update with your actual PythonAnywhere username!

### 2. Backend Configuration

#### `backend/app.py`
- Enhanced CORS configuration for both local and production
- Allows GitHub Pages and localhost origins
- **Action Required**: Uncomment and add your specific GitHub Pages URL

### 3. GitHub Actions

#### `.github/workflows/deploy-frontend.yml`
- Automatically builds and deploys frontend on push
- Uses environment variable for API URL
- **Action Required**: Set `PYTHONANYWHERE_URL` as GitHub secret (optional)

## ⚙️ How It Works

### Development Mode
1. Run backend: `cd backend && python app.py`
2. Run frontend: `cd frontend && npm start`
3. Frontend uses `.env.development` → connects to `localhost:5000`

### Production Mode
1. **Backend**: Deployed to PythonAnywhere
   - URL: `https://yourusername.pythonanywhere.com`
   - Serves API endpoints
   
2. **Frontend**: Deployed to GitHub Pages
   - URL: `https://yourusername.github.io/sql-visualizer`
   - Makes API calls to PythonAnywhere backend
   - Uses `.env.production` for API URL

### Communication Flow
```
User Browser
    ↓
GitHub Pages (Frontend)
    ↓ API calls
PythonAnywhere (Backend)
    ↓
SQLite Databases
```

## 🚀 Before You Deploy

### Step 1: Configure Backend URL

Edit `frontend/.env.production`:
```env
REACT_APP_API_URL=https://YOUR_USERNAME.pythonanywhere.com
```
Replace `YOUR_USERNAME` with your actual PythonAnywhere username!

### Step 2: Configure CORS

Edit `backend/app.py`, line ~24:
```python
cors_origins.append("https://YOUR_USERNAME.github.io")
```
Replace `YOUR_USERNAME` with your actual GitHub username!

### Step 3: Commit Changes

```bash
git add .
git commit -m "Configure for deployment"
git push origin main
```

## 📝 Environment Variables

The app uses React's environment variable system:

- **Development**: `REACT_APP_API_URL` from `.env.development`
- **Production**: `REACT_APP_API_URL` from `.env.production` or GitHub Secret

### Using GitHub Secrets (Optional, More Secure)

1. Go to your repo: Settings → Secrets and variables → Actions
2. Add secret: `PYTHONANYWHERE_URL`
3. Value: `https://yourusername.pythonanywhere.com`
4. The GitHub Actions workflow will use this automatically

## 🔒 Security Notes

1. **Never commit sensitive data** to the repository
2. The `.env.production` file contains your public API URL, which is fine
3. If you need to store sensitive keys, use GitHub Secrets
4. CORS is configured to only allow requests from your domains

## 🧪 Testing

After deployment, test:

1. **Backend**: `curl https://yourusername.pythonanywhere.com/api/schema`
2. **Frontend**: Visit `https://yourusername.github.io/sql-visualizer`
3. **Integration**: Run a SQL query and check browser console for errors

## 📚 Next Steps

1. Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions
2. Use [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md) for quick reference
3. Deploy backend to PythonAnywhere first
4. Then deploy frontend to GitHub Pages

## ❓ Common Questions

**Q: Can I use a custom domain?**
A: Yes! GitHub Pages and PythonAnywhere both support custom domains. See their documentation.

**Q: Is it free?**
A: Yes! Both GitHub Pages (for public repos) and PythonAnywhere (free tier) are free.

**Q: Can I keep both in the same repo?**
A: Yes! That's exactly what this setup does. GitHub Actions only deploys the `frontend/` folder.

**Q: How do I update after deployment?**
A: Just push to GitHub. Frontend deploys automatically. Backend needs a `git pull` and reload on PythonAnywhere.

## 🐛 Troubleshooting

See the troubleshooting sections in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- CORS errors
- 404 errors on GitHub Pages
- API connection issues
- Database not found errors
