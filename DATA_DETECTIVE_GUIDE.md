# Data Detective Mode - SQL Mystery Game

## Overview

The **Data Detective** module transforms SQL learning into an immersive narrative experience. Players take on the role of a detective in 1988, investigating a corporate sabotage case by analyzing database logs and evidence.

## The Story: "The Case of the Corrupted Mainframe"

**Setting:** 1988, OmniCorp Industries  
**Crime:** The revolutionary "Project Chimera" operating system was sabotaged  
**Mission:** Analyze system logs to find WHO did it, HOW they did it, and WHY

## How It Works

### State Machine Architecture

The mystery is structured as a state machine with progressive stages:
- Each stage presents a narrative and objective
- Players write SQL queries to solve the objective
- Correct solutions unlock clues and advance to the next stage
- Clues accumulate on a visual "Clue Board"

### The Investigation Database

Four interconnected tables contain the evidence:

1. **employees** - Personnel records with security clearances
2. **security_logs** - Physical access logs (who entered where and when)
3. **file_changelogs** - File system modification logs
4. **memos** - Company communications revealing motives

## The Six Stages

### Stage 1: The Crime Scene
**Objective:** Find the deleted file and timestamp  
**Skills Learned:** Basic SELECT with WHERE clause, date filtering

### Stage 2: The Suspects
**Objective:** Identify who had access to the Mainframe Room during the incident  
**Skills Learned:** Time range filtering, BETWEEN operator

### Stage 3: Identity Check
**Objective:** Cross-reference employee IDs with names and titles  
**Skills Learned:** JOIN operations, IN clause

### Stage 4: The Capability Question
**Objective:** Filter suspects by security clearance level  
**Skills Learned:** Compound WHERE conditions, numeric comparisons

### Stage 5: The Timeline
**Objective:** Construct chronological timeline of file actions  
**Skills Learned:** ORDER BY, multiple table queries

### Stage 6: The Motive
**Objective:** Search memos for information about the suspect  
**Skills Learned:** Text search, LIKE operator

### Final Stage: The Report
**Objective:** Compile comprehensive evidence package  
**Skills Learned:** Complex JOINs, data synthesis

## Technical Implementation

### Backend (`app.py`)

Three new endpoints:

1. **GET `/api/case/load`** - Returns case configuration from `case_file.json`
2. **GET `/api/case/schema`** - Returns case database schema
3. **POST `/api/case/solve`** - Validates query against current stage

### Frontend (`DataDetective.js`)

Key features:
- Two-panel layout: Investigation terminal + Case file
- Persistent "Clue Board" showing unlocked clues
- Progressive narrative that updates with each stage
- Visual feedback for correct/incorrect solutions
- Database schema reference panel

### Validation System

Multiple validation types handle different query requirements:
- `exact_columns` - Exact data match required
- `contains_ids` - Must include specific employee IDs
- `contains_names` - Must include specific names
- `exact_count_and_names` - Precise result count
- `ordered_sequence` - Results must be chronologically ordered
- `contains_text` - Must find specific text/keywords
- `final_report` - Comprehensive evidence validation

## Educational Benefits

### Problem Decomposition
Students learn to break down complex questions into smaller SQL queries

### Contextual Learning
Each query has a clear "why" - not just syntax practice, but solving real problems

### Intrinsic Motivation
The mystery narrative drives engagement more than simple exercises

### Progressive Difficulty
Stages build on each other, introducing SQL concepts gradually

## Usage

1. Click **"🔍 DATA DETECTIVE"** in the main interface
2. Read the case introduction and database schema
3. Click **"► BEGIN INVESTIGATION"**
4. For each stage:
   - Read the narrative and objective
   - Write a SQL query to solve it
   - Execute the query
   - Review results and validation feedback
5. Correct solutions unlock clues and advance the story
6. Complete all stages to solve the case!

## The Solution Path

**Stage 1:** `SELECT filename, timestamp FROM file_changelogs WHERE action='DELETED' AND timestamp LIKE '1988-03-15%'`

**Stage 2:** `SELECT DISTINCT employee_id FROM security_logs WHERE location='Mainframe Room' AND access_time BETWEEN '1988-03-15 02:00:00' AND '1988-03-15 02:30:00'`

**Stage 3:** `SELECT name, job_title FROM employees WHERE id IN (202, 103, 105)`

**Stage 4:** `SELECT name, security_clearance FROM employees WHERE id IN (202, 103, 105) AND security_clearance >= 4`

**Stage 5:** `SELECT timestamp, employee_id, filename, action FROM file_changelogs WHERE employee_id IN (202, 105) AND timestamp LIKE '1988-03-15%' ORDER BY timestamp`

**Stage 6:** `SELECT * FROM memos WHERE memo_text LIKE '%Marcus Vale%' OR memo_text LIKE '%202%'`

**Final:** Multiple approaches work - any query that shows Marcus Vale's employee record, his deletion action, and relevant evidence

## Extending the System

### Adding New Cases

1. Create a new database with your mystery data
2. Create a case configuration JSON file
3. Define stages with narratives and validation rules
4. Update the case loader to support multiple cases

### Customization Ideas

- Add more complex SQL requirements (subqueries, CTEs)
- Include red herrings and false leads
- Add time pressure elements
- Create branching narratives based on choices
- Add difficulty levels (beginner, intermediate, advanced)

## Files

- `/backend/omnicorp_case.db` - The investigation database
- `/backend/case_file.json` - Case configuration and validation rules
- `/frontend/src/components/DataDetective.js` - Main detective interface
- Backend endpoints in `/backend/app.py` (lines for case handling)

## Retro Theme Integration

The Data Detective fully embraces the retro terminal aesthetic:
- CRT screen effects on all panels
- Typewriter-style narrative reveals
- ASCII art borders and separators
- Terminal-style clue board
- Vintage computing atmosphere (1988 setting)

---

**Case Status:** READY FOR INVESTIGATION 🔍
