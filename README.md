# SQL Query Execution Visualizer 📊

An interactive educational platform that visualizes SQL query execution step-by-step. Perfect for learning SQL, understanding query processing, and mastering database concepts through hands-on practice.

## ✨ Key Features

### 🎓 Educational Platform
- **14 Progressive Lessons** across 4 modules (Basics → Joins → Aggregation → Advanced)
- **Interactive Challenges** with smart validation and instant feedback
- **Hint System** to help when you're stuck
- **Dual Modes**: Free exploration or guided learning

### 🔍 Query Visualization
- **Step-by-step execution** showing intermediate results at each stage:
  - FROM/JOIN - Initial dataset or table combinations
  - WHERE - Filtered results
  - GROUP BY - Aggregated data
  - SELECT - Column selection
  - ORDER BY - Final sorted results
- **Visual data flow** making SQL execution transparent

### 💡 Intelligent Feedback
- **SQL Linter** with 10+ best practice rules
- **Query Complexity Scoring** (Beginner → Expert)
- **Performance Tips** for optimization
- **Code Quality Suggestions** for better SQL

### 📚 Database Schema
- Pre-populated SQLite database with realistic sample data
- Employee and Department tables with relationships
- Perfect for practicing JOINs, aggregations, and filtering

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 14+** ([Download](https://nodejs.org/))
- **Git** (optional, for cloning)

### One-Command Start

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```batch
start.bat
```

The script will automatically:
1. Set up Python virtual environment
2. Install backend dependencies
3. Start Flask server on port 5000
4. Install frontend dependencies
5. Start React app on port 3000
6. Open your browser to http://localhost:3000

### Manual Setup

#### Backend Setup (Terminal 1)

```bash
cd backend
python -m venv venv

# Activate virtual environment
source venv/bin/activate          # Linux/Mac
# OR
venv\Scripts\activate              # Windows

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

Backend will run on **http://127.0.0.1:5000**

#### Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```

Frontend will open automatically on **http://localhost:3000**

## 📖 Learning Path

### Module 1: SQL Basics (5 Lessons)
1. **Selecting All Data** - Master the `SELECT *` statement
2. **Selecting Specific Columns** - Choose only what you need
3. **Filtering with WHERE** - Find specific records
4. **Sorting Results** - Order your data with `ORDER BY`
5. **Combining Clauses** - Use `WHERE` and `ORDER BY` together

### Module 2: Joining Tables (3 Lessons)
1. **INNER JOIN** - Combine related data from multiple tables
2. **LEFT JOIN** - Include all records from one table
3. **Filtering Joined Data** - Apply WHERE to combined results

### Module 3: Aggregation & Grouping (4 Lessons)
1. **Counting Rows** - Use `COUNT()` function
2. **GROUP BY Basics** - Group data for analysis
3. **Multiple Aggregates** - Combine `COUNT()`, `AVG()`, `SUM()`
4. **HAVING Clause** - Filter grouped results

### Module 4: Advanced Challenges (2 Lessons)
1. **Complex Analysis** - Real-world scenarios combining all concepts
2. **Performance Optimization** - Write efficient queries

## 🎯 Usage Guide

### Lesson Mode (Guided Learning)

1. Click **"Enter Lesson Mode"** button in the header
2. Select a module from the left sidebar
3. Choose a lesson to begin
4. Read the **objective** and **explanation**
5. Write your SQL query in the editor
6. Click **"Run Query"** to submit
7. Get instant feedback: ✅ Correct or ❌ Not Quite
8. Click **"Show Hint"** if you need help
9. View the **visualization** to understand execution
10. Progress to the next lesson!

### Free Query Mode (Exploration)

1. Stay in default mode or click **"Exit Lesson Mode"**
2. View the **database schema** on the left
3. Write any SQL SELECT query
4. Click **"Run Query"**
5. See **step-by-step visualization**
6. Review **tips** for code quality
7. Check **complexity score** to track difficulty

## 📊 Database Schema

### `employees` Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| name | TEXT | Employee name |
| salary | INTEGER | Annual salary |
| department_id | INTEGER | Foreign Key → departments.id |

**Sample Data:**
```
Alice   | $90,000  | Engineering
Bob     | $80,000  | Engineering
Charlie | $120,000 | Sales
David   | $75,000  | HR
Eve     | $150,000 | Sales
Frank   | $60,000  | (No department)
```

### `departments` Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| name | TEXT | Department name |
| location | TEXT | Office location |

**Sample Data:**
```
Engineering | New York
Sales       | London
HR          | New York
```

## 💻 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | Interactive UI components |
| **Styling** | Tailwind CSS | Modern, responsive design |
| **Backend** | Flask (Python) | REST API server |
| **Database** | SQLite | Lightweight, embedded database |
| **SQL Parsing** | sqlglot | AST-based query analysis |
| **Linting** | Custom Python | Code quality analysis |

## 🎨 Features in Detail

### Smart Query Validation

The platform doesn't just compare your query text—it executes both your query and the expected solution, then compares:
- **Column names** (order-independent)
- **Result data** (row-order-independent)
- **Row counts** for debugging

This means alternative correct solutions are accepted!

### SQL Linter Rules

Automatic analysis provides tips on:

| Category | Examples |
|----------|----------|
| 🔵 **Best Practice** | Avoid `SELECT *`, use explicit column names |
| ⚡ **Performance** | Add `LIMIT` to large queries, avoid leading wildcards in `LIKE` |
| 📖 **Readability** | Use uppercase for SQL keywords, add table aliases |
| ⚠️ **Safety** | `UPDATE`/`DELETE` without `WHERE` affects all rows |
| ✅ **Correctness** | `NOT IN` with NULL values, understand `COUNT(*)` vs `COUNT(column)` |

### Complexity Scoring

Queries are scored based on:
- Basic SELECT: +1 point
- WHERE clause: +1 point
- Each JOIN: +2 points
- GROUP BY: +2 points
- HAVING: +2 points
- ORDER BY: +1 point
- Each aggregate function: +1 point

**Levels:**
- 🟢 **Beginner** (0-3 points)
- 🔵 **Intermediate** (4-6 points)
- 🟠 **Advanced** (7-10 points)
- 🔴 **Expert** (11+ points)

## 📝 Example Queries

### Beginner Level

**Simple Selection:**
```sql
SELECT * FROM employees;
```

**Specific Columns:**
```sql
SELECT name, salary FROM employees;
```

**Filtering:**
```sql
SELECT name, salary 
FROM employees 
WHERE salary > 80000;
```

**Sorting:**
```sql
SELECT name, salary 
FROM employees 
ORDER BY salary DESC;
```

### Intermediate Level

**Inner Join:**
```sql
SELECT e.name, e.salary, d.name as department
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

**Left Join (include employees without departments):**
```sql
SELECT e.name, d.name as department
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
```

**Filtering Joined Data:**
```sql
SELECT e.name, e.salary, d.name as department
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE d.location = 'New York';
```

### Advanced Level

**Grouping and Aggregation:**
```sql
SELECT d.name as department, 
       COUNT(*) as employee_count,
       AVG(e.salary) as avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY d.name;
```

**Complex Analysis:**
```sql
SELECT d.name as department,
       d.location,
       COUNT(*) as emp_count,
       AVG(e.salary) as avg_salary,
       MAX(e.salary) as max_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary > 70000
GROUP BY d.name, d.location
HAVING COUNT(*) > 1
ORDER BY avg_salary DESC;
```

## 📁 Project Structure

```
sql-visualizer/
├── backend/
│   ├── app.py                 # Flask REST API with all endpoints
│   ├── linter.py              # SQL analysis and best practices checker
│   ├── curriculum.json        # 14 lessons across 4 modules
│   ├── employees.db           # SQLite database with sample data
│   └── requirements.txt       # Python dependencies (Flask, sqlglot, etc.)
│
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── SchemaViewer.js      # Database schema display
│   │   │   ├── SqlEditor.js         # Query input with Monaco editor
│   │   │   ├── Visualization.js     # Step-by-step execution display
│   │   │   ├── ResultsTable.js      # Query results table
│   │   │   ├── TipsPanel.js         # Linter tips & complexity score
│   │   │   ├── LessonsSidebar.js    # Curriculum navigation
│   │   │   └── LessonPanel.js       # Lesson details & hints
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Styling
│   │   └── index.js           # React entry point
│   ├── package.json           # Node dependencies (React, Tailwind, etc.)
│   └── tailwind.config.js     # Tailwind CSS configuration
│
├── start.sh                   # Linux/Mac startup script
├── start.bat                  # Windows startup script
└── README.md                  # This file
```

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/query` | POST | Execute SQL query, return results + visualization + tips |
| `/api/validate` | POST | Validate user query against lesson solution |
| `/api/schema` | GET | Return database schema (tables and columns) |
| `/api/curriculum` | GET | Return complete lesson curriculum |

## 🔧 Troubleshooting

### Backend Issues

**"Module not found" Error**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Port 5000 Already in Use**
```python
# Edit backend/app.py, change the last line:
app.run(debug=True, port=5001)  # Use different port
```

**Database Locked Error**
```bash
# Close any SQLite browser/tool accessing employees.db
# Or restart the Flask server
```

**"Only SELECT queries are allowed" Error**
- Make sure your query starts with `SELECT` (case-insensitive)
- Remove any leading comments or whitespace
- The app only accepts SELECT for security

### Frontend Issues

**Cannot Connect to Backend**
```bash
# Verify backend is running
curl http://127.0.0.1:5000/api/schema

# Check if Flask shows this in terminal:
# * Running on http://127.0.0.1:5000
```

**Port 3000 Already in Use**
```bash
# React will prompt you to use a different port
# Press 'Y' to accept the suggested alternative port
```

**npm Install Fails**
```bash
# Try clearing cache and reinstalling
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Styling Not Loading**
```bash
# Clear React cache and restart
rm -rf node_modules/.cache
npm start
```

### Common Issues

**Validation Always Fails in Lesson Mode**
- Check the console for specific error messages
- Make sure your query returns the same columns as the solution
- Row order doesn't matter, but column names and data must match

**Visualization Not Showing**
- Complex queries may fail to visualize but still execute
- Check the "Results" section for query output
- Try simpler queries first to test the feature

**Hints Not Appearing**
- Click the "💡 Show Hint" button in the lesson panel
- Not all lessons have hints available
- Hints are designed to guide, not give complete answers

## 🎓 Learning Tips

1. **Start with Lesson Mode** - Follow the curriculum for structured learning
2. **Read the Explanations** - Understand the "why" behind each concept
3. **Use Hints Wisely** - Try solving on your own first
4. **Check the Linter Tips** - Learn best practices as you go
5. **Experiment in Free Mode** - Try variations of queries to deepen understanding
6. **Watch the Visualization** - See how SQL processes your query step-by-step
7. **Compare Complexity Scores** - Track your progress as queries get more advanced

## 🚀 Future Enhancements

Potential additions to make this even better:

- [ ] User progress tracking and analytics
- [ ] Achievement badges system
- [ ] More lessons on window functions, CTEs, subqueries
- [ ] Export results to CSV/JSON
- [ ] Query performance metrics and EXPLAIN plans
- [ ] Multiple database support (PostgreSQL, MySQL)
- [ ] Visual query builder
- [ ] User accounts and saved queries
- [ ] Real-time collaboration mode
- [ ] Mobile-responsive design improvements

## 🤝 Contributing

This is an educational project. Feel free to:
- Report bugs or issues
- Suggest new lessons or features
- Improve documentation
- Add more linting rules
- Enhance the visualization

## 📄 License

This project is for educational purposes. Feel free to use it for learning and teaching SQL!

## 🙏 Acknowledgments

Built with:
- [React](https://reactjs.org/) - UI framework
- [Flask](https://flask.palletsprojects.com/) - Backend framework
- [sqlglot](https://github.com/tobymao/sqlglot) - SQL parser and transpiler
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor (VS Code's editor)

## 📧 Support

If you encounter issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the console logs (browser F12 for frontend, terminal for backend)
3. Make sure both servers are running
4. Verify you're using Python 3.8+ and Node.js 14+

---

**Happy Learning! 🎉** Start your SQL journey by running `./start.sh` (or `start.bat`) and entering Lesson Mode!
