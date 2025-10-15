# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Backend (Terminal 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

### Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend
npm install
npm start
```

Your browser will automatically open to `http://localhost:3000`

### Step 3: Try It Out!

1. You'll see the database schema on the left
2. Enter a SQL query or click a sample query
3. Click "Run Query"
4. Watch the step-by-step visualization appear on the right!

## 📝 First Query to Try

```sql
SELECT e.name, e.salary, d.name as department 
FROM employees e 
JOIN departments d ON e.department_id = d.id
WHERE e.salary > 80000
ORDER BY e.salary DESC
```

This query will show you:
- Step 1: FROM clause (employees table)
- Step 2: JOIN operation (combining with departments)
- Step 3: WHERE filtering (salary > 80000)
- Step 4: SELECT columns
- Step 5: ORDER BY sorting

## ⚡ One-Command Start (Linux/Mac)

```bash
./start.sh
```

## ⚡ One-Command Start (Windows)

```batch
start.bat
```

## ❓ Troubleshooting

**Backend won't start?**
- Make sure Python 3.x is installed: `python --version`
- Check if port 5000 is available

**Frontend won't start?**
- Make sure Node.js is installed: `node --version`
- Check if port 3000 is available
- Try: `npm install --force` if dependencies fail

**Can't connect to backend?**
- Verify backend is running on http://127.0.0.1:5000
- Check browser console for CORS errors
- Make sure both servers are running

## 🎯 What to Explore

1. **Basic Queries**: Start with `SELECT * FROM employees`
2. **Filtering**: Try `WHERE` clauses
3. **Joins**: Combine tables with `JOIN`
4. **Aggregation**: Use `GROUP BY` with `COUNT()`
5. **Sorting**: Add `ORDER BY` to see sorting in action

## 📚 Learning Resources

- See `README.md` for detailed documentation
- See `PROJECT_SUMMARY.md` for architecture details
- Check `backend/app.py` for backend logic
- Check `frontend/src/components/` for UI components

## 🎉 You're Ready!

The application is now running and ready to help you visualize SQL query execution!
