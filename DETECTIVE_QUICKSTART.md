# Quick Start: Data Detective Mode

## What is Data Detective?

An immersive SQL mystery game where you play a detective investigating a 1988 corporate sabotage case. Learn SQL by solving a real crime through database analysis!

## 🚀 How to Access

1. **Start the application** (if not already running):
   ```bash
   ./start.sh    # Linux/Mac
   start.bat     # Windows
   ```

2. **Navigate to** http://localhost:3000

3. **Click the "🔍 Data Detective" button** in the header

## 🎮 How to Play

### Step 1: Read the Briefing
- You'll see the case introduction
- Crime: Someone sabotaged Project Chimera
- Your job: Find WHO, HOW, and WHY

### Step 2: Review the Database
- 4 tables available:
  - `employees` - Personnel records
  - `security_logs` - Access logs
  - `file_changelogs` - File modifications
  - `memos` - Company communications

### Step 3: Start Investigation
- Click **"► BEGIN INVESTIGATION"**
- You'll see Stage 1: The Crime Scene

### Step 4: Solve Each Stage
For each stage:
1. Read the narrative and objective
2. Look at the hint (if needed)
3. Write a SQL query in the terminal
4. Click "Run Query"
5. Get instant feedback
6. Correct answer unlocks a clue
7. Automatically advances to next stage

### Step 5: Track Your Progress
- **Clue Board** on the right shows unlocked evidence
- **Schema panel** helps with table/column names
- **Narrative panel** tells the story

## 💡 Tips for Success

1. **Read carefully** - The narrative contains hints
2. **Start simple** - Begin with basic SELECT queries
3. **Check the schema** - Know your table structure
4. **Use the hints** - They guide you without spoiling
5. **Think like a detective** - What information do you need?
6. **Build on previous clues** - Each stage connects to the last

## 📝 Example First Query

**Stage 1 Objective:** Find the deleted file

Try something like:
```sql
SELECT filename, timestamp 
FROM file_changelogs 
WHERE action = 'DELETED';
```

## 🎯 The Six Stages

1. **The Crime Scene** - Find what was deleted
2. **The Suspects** - Who had access?
3. **Identity Check** - Names and roles
4. **The Capability Question** - Who could do it?
5. **The Timeline** - Sequence of events
6. **The Motive** - Why did they do it?
7. **Final Report** - Compile the evidence

## ⚡ Quick Commands

- **Exit anytime**: Click "← BACK TO MAIN" or "✕ EXIT"
- **See results**: Query results appear below the editor
- **Get unstuck**: Read the hint or try a simpler query first
- **Check tables**: Scroll down in schema panel

## 🏆 Win Condition

Complete all 6 stages by writing correct SQL queries. Each correct answer:
- ✓ Unlocks a clue
- ✓ Advances the story
- ✓ Brings you closer to solving the case

Final stage reveals the culprit and closes the case!

## 🐛 Troubleshooting

**Query rejected?**
- Make sure it's a SELECT query (not UPDATE/DELETE)
- Check for typos in table/column names
- Verify your query returns the required columns

**No results?**
- Check your WHERE conditions
- Verify table names match the schema
- Make sure date formats are correct

**Stuck on a stage?**
- Re-read the narrative for clues
- Click "Show Hint" for guidance
- Check what columns the stage asks for
- Try a basic query first, then refine

## 📚 Learning Outcomes

By completing this mystery, you'll practice:
- ✓ SELECT with WHERE clauses
- ✓ Date/time filtering
- ✓ JOIN operations
- ✓ Compound conditions
- ✓ ORDER BY sorting
- ✓ Text search with LIKE
- ✓ Complex data synthesis

## 🔗 Need More Help?

- See [DATA_DETECTIVE_GUIDE.md](DATA_DETECTIVE_GUIDE.md) for full walkthrough
- Check [README.md](README.md) for general SQL help
- Solutions are in the guide (but try solving first!)

---

**Ready to crack the case?** Click that 🔍 button and start investigating! 🕵️‍♂️
