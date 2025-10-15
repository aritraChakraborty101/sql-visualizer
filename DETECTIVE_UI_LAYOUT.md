# Data Detective UI Layout - Enhanced Version

## 📱 Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  [← BACK TO MAIN]                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  INVESTIGATION PROGRESS                                        42%  │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Stage 3 of 7 • 3 clues discovered                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────┬─────────────────────────┐
│  LEFT PANEL (2/3 width)                     │  RIGHT PANEL (1/3)      │
├─────────────────────────────────────────────┼─────────────────────────┤
│  ┌─────────────────────────────────────┐    │  ┌───────────────────┐  │
│  │ CASE #CASE_001                      │    │  │ 📋 CLUE BOARD     │  │
│  │ The Case of the Corrupted Mainframe │    │  ├───────────────────┤  │
│  │                                     │    │  │ CLUE #1           │  │
│  │ Stage 3: Identity Check             │    │  │ DELETION at       │  │
│  │                                     │    │  │ 02:15:30 AM       │  │
│  │ [Narrative text...]                 │    │  ├───────────────────┤  │
│  │                                     │    │  │ CLUE #2           │  │
│  │ OBJECTIVE:                          │    │  │ Suspects: #202,   │  │
│  │ Cross-reference employee IDs...     │    │  │ #103, #105        │  │
│  │                                     │    │  ├───────────────────┤  │
│  │ HINT:                               │    │  │ CLUE #3           │  │
│  │ Use JOIN or WHERE IN...             │    │  │ Names: Marcus,    │  │
│  │                                     │    │  │ Charlie, Edward   │  │
│  │ TABLES NEEDED:                      │    │  └───────────────────┘  │
│  │ employees (id, name, job_title...)  │    │                         │
│  └─────────────────────────────────────┘    │  ┌───────────────────┐  │
│                                              │  │ SQL QUICK REF     │  │
│  ┌──────────────────┬──────────────────┐    │  ├───────────────────┤  │
│  │ [💡 Show Example]│ [📝 Load Example]│    │  │ Basic SELECT      │  │
│  └──────────────────┴──────────────────┘    │  │ SELECT col FROM t │  │
│                                              │  ├───────────────────┤  │
│  ┌─────────────────────────────────────┐    │  │ WHERE Filtering   │  │
│  │ EXAMPLE SOLUTION:                   │    │  │ WHERE col = 'val' │  │
│  │                                     │    │  │ WHERE col LIKE    │  │
│  │ SELECT name, job_title              │    │  │   '1988-03%'      │  │
│  │ FROM employees                      │    │  ├───────────────────┤  │
│  │ WHERE id IN (...);                  │    │  │ JOIN Tables       │  │
│  │                                     │    │  │ FROM t1           │  │
│  │ Tip: Replace ... with values        │    │  │ JOIN t2 ON id     │  │
│  └─────────────────────────────────────┘    │  ├───────────────────┤  │
│                                              │  │ ORDER BY          │  │
│  ✗ The results don't match...               │  │ ORDER BY col DESC │  │
│                                              │  └───────────────────┘  │
│  ┌─────────────────────────────────────┐    │                         │
│  │ SQL TERMINAL:                       │    │  ┌───────────────────┐  │
│  │ ┌─────────────────────────────────┐ │    │  │ DATABASE SCHEMA   │  │
│  │ │ SELECT name, job_title          │ │    │  ├───────────────────┤  │
│  │ │ FROM employees                  │ │    │  │ ▸ employees       │  │
│  │ │ WHERE id IN (202, 103, 105);    │ │    │  │   id (INTEGER)    │  │
│  │ │                                 │ │    │  │   name (TEXT)     │  │
│  │ │                                 │ │    │  │   [preview]       │  │
│  │ │         [RUN QUERY]             │ │    │  ├───────────────────┤  │
│  │ └─────────────────────────────────┘ │    │  │ ▸ security_logs   │  │
│  └─────────────────────────────────────┘    │  │   log_id          │  │
│                                              │  │   employee_id     │  │
│  ┌─────────────────────────────────────┐    │  │   [preview]       │  │
│  │ QUERY RESULTS:                      │    │  ├───────────────────┤  │
│  │ ┌─────────────────────────────────┐ │    │  │ ▸ file_changelogs │  │
│  │ │ name         | job_title        │ │    │  │   change_id       │  │
│  │ │──────────────┼──────────────────│ │    │  │   timestamp       │  │
│  │ │ Charlie Ross | Intern           │ │    │  │   [preview]       │  │
│  │ │ Edward Price | Database Admin   │ │    │  ├───────────────────┤  │
│  │ │ Marcus Vale  | Senior Developer │ │    │  │ ▸ memos           │  │
│  │ └─────────────────────────────────┘ │    │  │   memo_id         │  │
│  └─────────────────────────────────────┘    │  │   memo_text       │  │
│                                              │  │   [preview]       │  │
│  ┌─────────────────────────────────────┐    │  └───────────────────┘  │
│  │ QUERY HISTORY:           [clear]    │    │                         │
│  │ ┌─────────────────────────────────┐ │    │                         │
│  │ │ 14:32:15                        │ │    │                         │
│  │ │ SELECT * FROM employees;        │ │    │                         │
│  │ ├─────────────────────────────────┤ │    │                         │
│  │ │ 14:31:02                        │ │    │                         │
│  │ │ SELECT employee_id              │ │    │                         │
│  │ │ FROM security_logs...           │ │    │                         │
│  │ └─────────────────────────────────┘ │    │                         │
│  └─────────────────────────────────────┘    │                         │
└─────────────────────────────────────────────┴─────────────────────────┘
```

## 📊 Table Preview Modal

When user clicks "preview" on any table:

```
┌───────────────────────────────────────────────────────────┐
│                  [OVERLAY - 80% opacity]                  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ TABLE: employees                     [✕ CLOSE]      │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ Showing first 5 rows:                               │ │
│  │                                                     │ │
│  │ ┌─────────────────────────────────────────────────┐ │ │
│  │ │ id  | name         | job_title      | clearance│ │ │
│  │ │─────┼──────────────┼────────────────┼──────────│ │ │
│  │ │ 101 | Alice Harper | Lead Prog      | 5        │ │ │
│  │ │ 102 | Bob Matthews | Systems Analyst| 4        │ │ │
│  │ │ 103 | Charlie Ross | Intern         | 2        │ │ │
│  │ │ 104 | Diana Cole   | Security Off   | 5        │ │ │
│  │ │ 105 | Edward Price | Database Admin | 5        │ │ │
│  │ └─────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## 🎨 Visual Features

### Progress Bar
- **Color**: Uses terminal text color (green/amber/blue based on theme)
- **Glow**: Terminal glow effect on filled portion
- **Animation**: Smooth 500ms transition when advancing
- **Height**: 16px with border

### Example Query Panel
- **Appearance**: Bordered box with slightly transparent background
- **Font**: Monospace for code readability
- **Color**: Slightly dimmed (75% opacity)
- **Placeholder**: Uses "..." for values user must fill

### Clue Board
- **Animation**: Pulse effect (2s duration) on each clue
- **Border**: Terminal border color
- **Layout**: Stacked clues with numbering
- **Empty State**: "No clues discovered yet..." message

### Table Preview Buttons
- **Style**: Small underlined text links
- **Hover**: Opacity increases from 75% to 100%
- **Position**: Right-aligned next to table name

### Query History
- **Max Display**: Last 5 queries (reversed order)
- **Scroll**: Vertical scroll if more than fits
- **Format**: Timestamp + query in monospace
- **Clear**: Small underlined link to reset

### SQL Quick Reference
- **Compact**: 4 common patterns in bordered boxes
- **Font Size**: xs (extra small)
- **Spacing**: Minimal padding for info density
- **Opacity**: 75% for reference material

## 🎯 Interaction Flow

1. **User reads narrative** → Understands goal
2. **Checks example query** → Sees SQL structure
3. **Previews tables** → Views actual data
4. **Reviews clues** → Uses previous findings
5. **Checks quick ref** → Refreshes syntax
6. **Writes query** → Crafts solution
7. **Executes** → Sees results
8. **Reviews history** → Learns from attempts
9. **Advances** → Progress bar updates

## 📱 Responsive Notes

- **Desktop**: 3-column layout (2/3 left, 1/3 right)
- **Tablet**: Stacks to single column
- **Mobile**: All panels stack vertically
- **Modals**: Full-screen on mobile, centered on desktop

## 🎨 Theme Integration

All new features respect the theme system:
- ✅ Progress bar uses `--terminal-text` color
- ✅ Borders use `--terminal-border` color
- ✅ Glow effects use `--terminal-glow`
- ✅ Background uses `--terminal-bg`
- ✅ CRT effects apply to all containers
- ✅ Normal theme gets clean, modern styling

## 🚀 Performance

- **Query history**: Limited to 5 items (minimal memory)
- **Table preview**: Only loads on demand (lazy)
- **Examples**: Static strings (no computation)
- **Progress**: Simple calculation (stage index / total)
- **Modals**: Render only when shown

---

**Result**: A rich, helpful interface that guides users through the investigation without overwhelming them!
