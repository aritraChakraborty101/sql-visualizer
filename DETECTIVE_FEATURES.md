# Data Detective - Enhanced Features Guide

## 🎯 New Visualization & Progress Features

The Data Detective has been enhanced with powerful features to make the investigation easier and more intuitive!

## 📊 Visual Progress Tracking

### Progress Bar
- **Location**: Top of screen below the exit button
- **Shows**: Current stage number, completion percentage, clues discovered
- **Visual**: Animated progress bar with terminal glow effect
- **Updates**: Automatically advances as you solve each stage

### What You See:
```
INVESTIGATION PROGRESS                    42%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stage 3 of 7 • 3 clues discovered
```

## 💡 Example Query System

### Show Example Query Button
- **Location**: Below the objective/hint section
- **Function**: Reveals example query structure for current stage
- **Features**:
  - Shows query template with placeholders (...)
  - Hides sensitive details to encourage learning
  - Helps understand SQL structure needed

### Load Example Button
- **Function**: Auto-fills the complete solution into editor
- **Use Case**: When truly stuck after trying
- **Tip**: Try solving first, then use as last resort

### How to Use:
1. Click **"💡 Show Example Query"** to see structure
2. Try writing your own query based on the example
3. If stuck, click **"📝 Load Example"** to auto-fill solution

## 🔍 Table Preview System

### Preview from Schema Panel
- **Location**: Schema panel on the right side
- **How**: Click **"preview"** next to any table name
- **Shows**: First 5 rows of actual data
- **Benefits**: 
  - See real data structure
  - Understand what values look like
  - Find patterns and clues

### Preview from Intro Screen
- **Location**: Database access section on intro
- **How**: Click **"preview data →"** next to table names
- **Use**: Explore data before starting investigation

### What You See:
```
TABLE: employees
Showing first 5 rows:

id    name          job_title         security_clearance
101   Alice Harper  Lead Programmer   5
102   Bob Matthews  Systems Analyst   4
...
```

## 📝 Query History Panel

### Features:
- **Shows**: Last 5 queries you've executed
- **Displays**: Query text + timestamp
- **Benefits**:
  - Review what you've tried
  - Learn from mistakes
  - Track your investigation path

### Controls:
- **Clear History**: Click "clear" to reset
- **Auto-update**: New queries appear at top
- **Scroll**: View older queries in the list

### Location:
Below query results on left panel

## 📚 SQL Quick Reference

### What's Included:
A handy cheat sheet with common SQL patterns:

1. **Basic SELECT**
   ```sql
   SELECT column1, column2 FROM table;
   ```

2. **WHERE Filtering**
   ```sql
   WHERE column = 'value'
   WHERE column LIKE '1988-03-15%'
   WHERE column BETWEEN x AND y
   ```

3. **JOIN Tables**
   ```sql
   FROM table1 t1
   JOIN table2 t2 ON t1.id = t2.id
   ```

4. **ORDER BY**
   ```sql
   ORDER BY column ASC/DESC
   ```

### Location:
Right panel, below clue board

## 🎮 Enhanced Workflow

### Recommended Investigation Process:

1. **Read the Narrative** - Understand what's needed
2. **Check the Objective** - Know your goal
3. **Preview Tables** - See what data is available
4. **Review Clues** - Use previously discovered evidence
5. **Check Quick Reference** - Refresh SQL syntax
6. **Show Example** - See query structure if needed
7. **Write Query** - Craft your solution
8. **Review History** - Learn from previous attempts
9. **Execute & Validate** - Run your query

## 💪 Making Progress Easier

### When You're Stuck:

**Level 1 - Hints Already There:**
- Read the objective carefully
- Check "TABLES NEEDED" section
- Review the hint

**Level 2 - Use Examples:**
- Click "Show Example Query"
- Study the structure
- Replace ... with actual values from clues

**Level 3 - Preview Data:**
- Click "preview" on relevant tables
- See what data looks like
- Find the values you need

**Level 4 - Check History:**
- Review previous queries
- See what worked/didn't work
- Build on successful patterns

**Level 5 - Load Solution:**
- Click "Load Example" as last resort
- Study the loaded query
- Understand why it works

## 🌟 Pro Tips

### Use Clue Board Values
Previous clues often contain values needed for next stage:
- Employee IDs from Stage 2 → Use in Stage 3
- Names from Stage 3 → Search in Stage 6
- Build knowledge progressively

### Preview Smart
Before writing complex queries:
1. Preview the table
2. Identify the columns you need
3. Note the data format (dates, text, numbers)
4. Craft your WHERE clause accordingly

### Learn from Examples
When you load an example:
- Don't just run it - READ it
- Understand each part of the query
- Note the structure for future stages
- Adapt the pattern to similar problems

### Track Your Progress
Use the progress bar to:
- Know how far you've come
- See stages remaining
- Feel accomplished with each clue

## 🎯 Feature Summary

| Feature | Location | Purpose |
|---------|----------|---------|
| **Progress Bar** | Top of screen | Track completion |
| **Example Query** | Below narrative | Show query structure |
| **Load Example** | Next to example button | Auto-fill solution |
| **Table Preview** | Schema panel | View sample data |
| **Query History** | Below results | Review attempts |
| **SQL Reference** | Right panel | Quick syntax help |

## 🚀 Getting Started

1. **Start Investigation**
2. **Preview all 4 tables** to understand data
3. **Read Stage 1 objective**
4. **Show example query** to see structure
5. **Preview file_changelogs table**
6. **Write your query** using the pattern
7. **Execute and solve!**

## 🔧 Keyboard Shortcuts

- **Ctrl/Cmd + Enter** - Run query (in SQL editor)
- **ESC** - Close table preview modal
- Click outside modal - Close preview

## 📈 Success Metrics

With these features, you should:
- ✅ Solve stages faster
- ✅ Understand SQL patterns better
- ✅ Feel less frustrated when stuck
- ✅ Learn by seeing actual data
- ✅ Track your investigation journey

---

**Happy Investigating!** 🔍 Use these tools wisely and you'll crack the case in no time!
