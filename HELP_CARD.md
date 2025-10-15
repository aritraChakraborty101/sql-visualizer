# Data Detective - Quick Help Card

## 🆘 Stuck? Use These Tools!

### 🎯 Progressive Help System

```
┌─────────────────────────────────────────────┐
│  WHEN STUCK - TRY IN THIS ORDER:           │
├─────────────────────────────────────────────┤
│  1. 📖 Re-read the objective & hint         │
│  2. 📋 Check your clues board               │
│  3. 🔍 Preview the table (see actual data)  │
│  4. 📚 Check SQL Quick Reference            │
│  5. 💡 Show Example Query (see structure)   │
│  6. 📝 Review Query History (learn from it) │
│  7. ⚠️  Load Example (last resort!)         │
└─────────────────────────────────────────────┘
```

## 🔧 Feature Quick Access

### Progress Bar (Top of Screen)
- **What**: Shows % complete + stage number + clues found
- **Why**: Track your progress visually
- **Tip**: Each clue = one stage solved!

### 💡 Example Query Buttons
- **Show Example**: Reveals query structure with placeholders
- **Load Example**: Auto-fills complete solution
- **When**: Use Show first, Load only if truly stuck
- **Tip**: Study the example, don't just run it!

### 🔍 Table Preview (Schema Panel)
- **How**: Click "preview" next to any table name
- **Shows**: First 5 rows of actual data
- **Why**: See what values look like
- **Tip**: Preview before writing WHERE clauses!

### 📝 Query History (Below Results)
- **Shows**: Last 5 queries + timestamps
- **Why**: Learn from mistakes
- **Clear**: Click "clear" to reset
- **Tip**: Compare failed vs successful queries

### 📚 SQL Quick Reference (Right Panel)
- **Contains**: 4 essential SQL patterns
- **Always visible**: No need to scroll far
- **Covers**: SELECT, WHERE, JOIN, ORDER BY
- **Tip**: Copy the structure, adapt to your needs

## 🎮 Solving Strategy

### Stage 1-2: Beginner Stages
```
1. Read objective carefully
2. Preview the needed table
3. Write simple SELECT with WHERE
4. Use LIKE for date matching
```

### Stage 3-4: Intermediate
```
1. Use clues from previous stages
2. Preview employees table
3. Use IN clause with found IDs
4. Add number comparisons
```

### Stage 5-6: Advanced
```
1. Combine multiple clues
2. Use ORDER BY for timeline
3. Use LIKE for text search
4. Reference multiple tables
```

### Final Stage: Expert
```
1. Review ALL clues collected
2. May need JOIN operation
3. Show comprehensive evidence
4. Include employee + action + evidence
```

## 💡 Pro Tips

### Understanding Examples
When you show/load example:
- **Don't just run it** - Read and understand each part
- **Note the structure** - Apply pattern to similar problems
- **Replace ...** with actual values from your clues
- **Learn for future** - Stages build on each other

### Using Table Previews
- **Before Stage 1**: Preview all 4 tables to understand data
- **During stages**: Preview when you need to know values
- **Look for patterns**: Dates, IDs, text that match clues
- **Note column names**: Use exact names in your queries

### Leveraging Clues
- **Stage 2 → Stage 3**: Use employee IDs found
- **Stage 3 → Stage 4**: Filter by names/clearance
- **Stage 4 → Stage 5**: Track those employees' actions
- **All clues → Final**: Compile comprehensive report

### Query History Best Use
- **After error**: See what went wrong
- **Compare results**: What worked vs didn't
- **Pattern learning**: Notice successful structures
- **Avoid repeating**: Don't try same query twice

## 🎯 Common Mistakes & Fixes

| Mistake | Fix |
|---------|-----|
| Query returns nothing | Check table preview - verify values exist |
| Wrong columns | Read objective - shows required columns |
| Can't remember syntax | Check Quick Reference panel |
| Forgot previous IDs | Look at Clue Board - they're saved there |
| Complex query fails | Start simple, add WHERE clauses one by one |
| Wrong date format | Use LIKE '1988-03-15%' for date filtering |

## 🔍 Debugging Checklist

When query fails:
```
☐ Are column names spelled correctly?
☐ Are table names exact? (case-sensitive in some DBs)
☐ Did I preview the table to verify values?
☐ Are dates in correct format? (YYYY-MM-DD HH:MI:SS)
☐ Did I use quotes for text values? ('text')
☐ Did I check previous clues for required values?
☐ Is my query returning the required columns?
```

## 📊 Stage-by-Stage Hints

### Stage 1: The Crime Scene
- 🎯 Find ONE deleted file
- 📅 Date: March 15, 1988
- 🔑 Columns: filename, timestamp
- 💡 Use: WHERE action = 'DELETED'

### Stage 2: The Suspects  
- 🎯 Find who accessed Mainframe Room
- ⏰ Time: 02:00 to 02:30
- 🔑 Column: employee_id
- 💡 Use: WHERE BETWEEN for time range

### Stage 3: Identity Check
- 🎯 Get names of suspects
- 👥 Use IDs from Stage 2
- 🔑 Columns: name, job_title
- 💡 Use: WHERE id IN (...)

### Stage 4: Capability Question
- 🎯 Filter by security clearance
- 🔒 Level: 4 or higher
- 🔑 Columns: name, security_clearance
- 💡 Use: AND security_clearance >= 4

### Stage 5: The Timeline
- 🎯 Get chronological actions
- 📋 Focus on remaining suspects
- 🔑 All file_changelogs columns
- 💡 Use: ORDER BY timestamp

### Stage 6: The Motive
- 🎯 Search company memos
- 🔍 Look for suspect references
- 🔑 All memos columns
- 💡 Use: WHERE LIKE '%keyword%'

### Final: The Report
- 🎯 Complete evidence package
- 🔗 May need JOIN
- 🔑 Employee + file + action data
- 💡 Combine all findings

## 🚀 Success Formula

```
Read → Preview → Think → Write → Execute → Learn → Advance
 ↓       ↓        ↓       ↓        ↓        ↓        ↓
Narrative → Data → Clues → Query → Results → History → Next Stage
```

## 📞 Still Stuck?

1. **Re-read** the narrative (clues are hidden there!)
2. **Preview** ALL tables to understand data structure
3. **Show Example** to see the query pattern
4. **Study** the example - understand WHY it works
5. **Load Example** if absolutely necessary
6. **Move forward** and come back later if needed

Remember: It's OK to use help! The goal is to LEARN, not struggle endlessly.

---

**You've got this, Detective!** 🔍✨ Use these tools wisely and you'll crack the case!
