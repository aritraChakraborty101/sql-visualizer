import React, { useState, useEffect, useRef } from 'react';
import SqlEditor from './SqlEditor';
import ResultsTable from './ResultsTable';
import Footer from './Footer';
import './DetectiveAnimations.css';

const DataDetective = ({ theme, onExit }) => {
  const [caseData, setCaseData] = useState(null);
  const [currentStage, setCurrentStage] = useState('stage_1');
  const [cluesUnlocked, setCluesUnlocked] = useState([]);
  const [narrative, setNarrative] = useState('');
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);
  const [queryResults, setQueryResults] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [caseSchema, setCaseSchema] = useState({});
  const [query, setQuery] = useState('');
  const [showExampleQuery, setShowExampleQuery] = useState(false);
  const [tablePreview, setTablePreview] = useState(null);
  const [showTablePreview, setShowTablePreview] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  
  // Animation states
  const [showClueReveal, setShowClueReveal] = useState(false);
  const [revealingClue, setRevealingClue] = useState(null);
  const [showError, setShowError] = useState(false);
  const [narrativeTransition, setNarrativeTransition] = useState(false);
  const [showCaseClosedStamp, setShowCaseClosedStamp] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [clueNotification, setClueNotification] = useState(null);
  
  const narrativeRef = useRef(null);
  const audioContextRef = useRef(null);

  const isRetroTheme = theme !== 'normal';

  useEffect(() => {
    loadCase();
    loadCaseSchema();
    
    // Listen for skip animation key press
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setSkipAnimation(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Sound effects using Web Audio API
  const playSound = (type) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch(type) {
      case 'success':
        // Success chime - ascending notes
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
        
      case 'error':
        // Error buzz - harsh low frequency
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        break;
        
      case 'clue':
        // Clue unlock - mysterious tone
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;
        
      case 'stamp':
        // Case closed stamp - thud sound
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
        
      default:
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }
  };

  const loadCase = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/case/load');
      const data = await response.json();
      setCaseData(data);
      setNarrative(data.intro_narrative);
      setLoading(false);
    } catch (error) {
      console.error('Error loading case:', error);
      setLoading(false);
    }
  };

  const loadCaseSchema = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/case/schema');
      const schema = await response.json();
      setCaseSchema(schema);
    } catch (error) {
      console.error('Error loading schema:', error);
    }
  };

  const startInvestigation = () => {
    setShowIntro(false);
    const stage = caseData.stages[currentStage];
    setNarrative(stage.narrative);
  };

  const previewTable = async (tableName) => {
    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `SELECT * FROM ${tableName} LIMIT 5` })
      });
      
      const data = await response.json();
      if (data.results) {
        setTablePreview({ name: tableName, data: data.results });
        setShowTablePreview(true);
      }
    } catch (error) {
      console.error('Error previewing table:', error);
    }
  };

  const loadExampleQuery = () => {
    const examples = {
      'stage_1': "SELECT filename, timestamp\nFROM file_changelogs\nWHERE action = 'DELETED'\n  AND timestamp LIKE '1988-03-15%';",
      'stage_2': "SELECT DISTINCT employee_id\nFROM security_logs\nWHERE location = 'Mainframe Room'\n  AND access_time BETWEEN '1988-03-15 02:00:00' \n                      AND '1988-03-15 02:30:00';",
      'stage_3': "SELECT name, job_title\nFROM employees\nWHERE id IN (202, 103, 105);",
      'stage_4': "SELECT name, security_clearance\nFROM employees\nWHERE id IN (202, 103, 105)\n  AND security_clearance >= 4;",
      'stage_5': "SELECT timestamp, employee_id, filename, action\nFROM file_changelogs\nWHERE employee_id IN (202, 105)\n  AND timestamp LIKE '1988-03-15%'\nORDER BY timestamp;",
      'stage_6': "SELECT *\nFROM memos\nWHERE memo_text LIKE '%Marcus Vale%'\n   OR memo_text LIKE '%202%';",
      'final_stage': "SELECT e.name, e.security_clearance, f.filename, f.action, f.timestamp\nFROM employees e\nJOIN file_changelogs f ON e.id = f.employee_id\nWHERE e.id = 202\n  AND f.action = 'DELETED';"
    };
    
    if (examples[currentStage]) {
      setQuery(examples[currentStage]);
      setShowExampleQuery(false);
    }
  };

  const handleQueryExecute = async (userQuery) => {
    setSolving(true);
    setFeedback('');
    setShowError(false);
    
    // Add to history
    setQueryHistory([...queryHistory, { query: userQuery, timestamp: new Date().toLocaleTimeString() }]);
    
    try {
      // First execute the query to get results for display
      const queryResponse = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      });

      const queryData = await queryResponse.json();
      if (queryResponse.ok && queryData.results) {
        setQueryResults(queryData.results);
      }

      // Then validate against the case stage
      const response = await fetch('http://localhost:5000/api/case/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          stage_id: currentStage
        })
      });

      const result = await response.json();
      
      // Show results even if incorrect for learning
      if (result.is_correct) {
        // SUCCESS ANIMATION SEQUENCE
        playSound('success');
        setFeedback(`✓ ${result.feedback}`);
        
        // Unlock clue with animation
        if (result.clue_unlocked) {
          playSound('clue');
          setRevealingClue(result.clue_unlocked);
          setShowClueReveal(true);
          
          // Show notification
          setClueNotification(result.clue_unlocked);
          setTimeout(() => setClueNotification(null), 3000);
          
          const animationDuration = skipAnimation ? 0 : 2000;
          
          setTimeout(() => {
            setCluesUnlocked([...cluesUnlocked, result.clue_unlocked]);
            setShowClueReveal(false);
            setRevealingClue(null);
            setSkipAnimation(false);
          }, animationDuration);
        }
        
        // Move to next stage or show completion
        if (result.next_stage) {
          const transitionDelay = skipAnimation ? 500 : 2500;
          
          setTimeout(() => {
            setNarrativeTransition(true);
            
            setTimeout(() => {
              setCurrentStage(result.next_stage);
              setNarrative(caseData.stages[result.next_stage].narrative);
              setFeedback('');
              setQueryResults(null);
              setQuery('');
              setShowExampleQuery(false);
              setNarrativeTransition(false);
            }, skipAnimation ? 0 : 800);
          }, transitionDelay);
        } else if (result.completion_message) {
          const completionDelay = skipAnimation ? 500 : 2500;
          
          setTimeout(() => {
            setNarrative(result.completion_message);
            setFeedback('');
            setShowCaseClosedStamp(true);
            playSound('stamp');
          }, completionDelay);
        }
      } else {
        // FAILURE ANIMATION
        playSound('error');
        setShowError(true);
        setFeedback(`✗ ${result.feedback}`);
        
        setTimeout(() => setShowError(false), 500);
      }
      
    } catch (error) {
      playSound('error');
      setShowError(true);
      setFeedback(`Error: ${error.message}`);
      setTimeout(() => setShowError(false), 500);
    } finally {
      setSolving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen terminal-text">
        <div className="text-2xl">LOADING CASE FILES...</div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="min-h-screen p-8 terminal-text">
        <div className="max-w-4xl mx-auto crt-container p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold mb-2 text-glow">DATA DETECTIVE</h1>
              <div className="text-sm opacity-75">A SQL Mystery Adventure</div>
            </div>
            <button
              onClick={onExit}
              className="terminal-button text-sm px-3 py-1"
            >
              ✕ EXIT
            </button>
          </div>
          
          <div className="border-2 border-current p-6 mb-8">
            <div className="text-2xl font-bold mb-4">{caseData.title}</div>
            <div className="text-sm mb-2">CLIENT: {caseData.client}</div>
            <div className="text-sm mb-4">YEAR: {caseData.year}</div>
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {narrative}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl mb-3">DATABASE ACCESS GRANTED:</h3>
            <div className="border border-current p-4">
              {Object.entries(caseSchema).map(([tableName, columns]) => (
                <div key={tableName} className="mb-3">
                  <div className="flex justify-between items-center">
                    <div className="font-bold">▸ {tableName}</div>
                    <button
                      onClick={() => previewTable(tableName)}
                      className="text-xs underline opacity-75 hover:opacity-100"
                    >
                      preview data →
                    </button>
                  </div>
                  <div className="ml-4 text-sm opacity-75">
                    {columns.map(col => col.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startInvestigation}
            className="terminal-button w-full py-3 text-lg"
          >
            ► BEGIN INVESTIGATION
          </button>
        </div>

        {/* Table Preview Modal for Intro */}
        {showTablePreview && tablePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="crt-container p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">TABLE: {tablePreview.name}</h3>
                <button
                  onClick={() => setShowTablePreview(false)}
                  className="terminal-button text-sm px-3 py-1"
                >
                  ✕ CLOSE
                </button>
              </div>
              <div className="text-xs mb-2 opacity-75">Sample data (first 5 rows):</div>
              <ResultsTable results={tablePreview.data} isRetroTheme={isRetroTheme} />
            </div>
          </div>
        )}
      </div>
    );
  }

  const stage = caseData.stages[currentStage];
  const isCaseClosed = currentStage === 'final_stage' && cluesUnlocked.length >= 6;
  
  // Calculate progress
  const stageOrder = ['stage_1', 'stage_2', 'stage_3', 'stage_4', 'stage_5', 'stage_6', 'final_stage'];
  const currentStageIndex = stageOrder.indexOf(currentStage);
  const progressPercentage = ((currentStageIndex + (cluesUnlocked.length > currentStageIndex ? 1 : 0)) / stageOrder.length) * 100;

  return (
    <div className="min-h-screen p-4">
      {/* Exit Button */}
      <div className="max-w-7xl mx-auto mb-2">
        <button
          onClick={onExit}
          className="terminal-button text-sm px-3 py-1"
        >
          ← BACK TO MAIN
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="crt-container p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold">INVESTIGATION PROGRESS</div>
            <div className="text-sm">{Math.round(progressPercentage)}%</div>
          </div>
          <div className="w-full bg-black bg-opacity-50 border border-current h-4">
            <div 
              className="h-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: 'var(--terminal-text)',
                boxShadow: '0 0 10px var(--terminal-glow)'
              }}
            />
          </div>
          <div className="mt-2 text-xs opacity-75">
            Stage {currentStageIndex + 1} of {stageOrder.length} • {cluesUnlocked.length} clues discovered
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {/* Left Panel - Terminal & Query */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="crt-container p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-glow">CASE #{caseData.case_id.toUpperCase()}</h2>
                <div className="text-sm opacity-75">{caseData.title}</div>
              </div>
              <div className="text-right text-sm">
                <div>STAGE: {currentStage.toUpperCase()}</div>
                <div>CLUES: {cluesUnlocked.length}</div>
              </div>
            </div>

            <div className={`border-2 border-current p-4 mb-4 bg-opacity-20 ${narrativeTransition ? 'screen-wipe' : ''}`}>
              <div className="text-lg font-bold mb-2 message-header">{stage?.title}</div>
              <div className={`whitespace-pre-wrap text-sm leading-relaxed mb-3 ${narrativeTransition ? 'message-scroll-out' : 'message-scroll-in'}`} ref={narrativeRef}>
                {narrative}
              </div>
              {stage?.objective && (
                <div className="border-t border-current pt-3 mt-3">
                  <div className="text-xs opacity-75 mb-1">OBJECTIVE:</div>
                  <div className="text-sm">{stage.objective}</div>
                </div>
              )}
              {stage?.hint && (
                <div className="border-t border-current pt-3 mt-3">
                  <div className="text-xs opacity-75 mb-1">HINT:</div>
                  <div className="text-sm opacity-60">{stage.hint}</div>
                </div>
              )}
              {stage?.schema_hint && (
                <div className="border-t border-current pt-3 mt-3">
                  <div className="text-xs opacity-75 mb-1">TABLES NEEDED:</div>
                  <div className="text-sm opacity-60">{stage.schema_hint}</div>
                </div>
              )}
            </div>

            {/* Help Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowExampleQuery(!showExampleQuery)}
                className="terminal-button text-xs px-3 py-1 flex-1"
              >
                {showExampleQuery ? '✕ Hide' : '💡 Show'} Example Query
              </button>
              <button
                onClick={loadExampleQuery}
                className="terminal-button text-xs px-3 py-1 flex-1"
                disabled={!showExampleQuery}
              >
                📝 Load Example
              </button>
            </div>

            {showExampleQuery && (
              <div className="border-2 border-current p-3 mb-4 bg-opacity-20">
                <div className="text-xs opacity-75 mb-2">EXAMPLE SOLUTION:</div>
                <pre className="text-xs font-mono whitespace-pre-wrap opacity-75">
                  {currentStage === 'stage_1' && "SELECT filename, timestamp\nFROM file_changelogs\nWHERE action = 'DELETED'\n  AND timestamp LIKE '1988-03-15%';"}
                  {currentStage === 'stage_2' && "SELECT DISTINCT employee_id\nFROM security_logs\nWHERE location = 'Mainframe Room'\n  AND access_time BETWEEN '...' AND '...';"}
                  {currentStage === 'stage_3' && "SELECT name, job_title\nFROM employees\nWHERE id IN (...);"}
                  {currentStage === 'stage_4' && "SELECT name, security_clearance\nFROM employees\nWHERE id IN (...)\n  AND security_clearance >= ?;"}
                  {currentStage === 'stage_5' && "SELECT timestamp, employee_id, filename, action\nFROM file_changelogs\nWHERE employee_id IN (...)\nORDER BY timestamp;"}
                  {currentStage === 'stage_6' && "SELECT *\nFROM memos\nWHERE memo_text LIKE '%keyword%';"}
                  {currentStage === 'final_stage' && "SELECT e.name, f.filename, f.action\nFROM employees e\nJOIN file_changelogs f ON e.id = f.employee_id\nWHERE ...;"}
                </pre>
                <div className="text-xs mt-2 opacity-50">
                  Tip: Replace ... with actual values from previous clues
                </div>
              </div>
            )}

            {feedback && (
              <div className={`border-2 p-3 mb-4 relative ${
                feedback.startsWith('✓') 
                  ? 'border-current success-flash access-granted' 
                  : 'border-current access-denied error-buzz'
              } ${showError ? 'digital-static screen-glitch' : ''}`}>
                <div className="font-mono relative z-20">
                  {feedback.startsWith('✓') && (
                    <div className="text-xs opacity-75 mb-1">&gt; QUERY HASH MATCH... ACCESS GRANTED</div>
                  )}
                  {feedback.startsWith('✗') && (
                    <div className="text-xs opacity-75 mb-1 animate-pulse">&gt; ACCESS DENIED</div>
                  )}
                  {feedback}
                </div>
              </div>
            )}
          </div>

          <div className="crt-container p-4 flex-1 flex flex-col">
            <div className="text-sm mb-2 opacity-75">SQL TERMINAL:</div>
            <SqlEditor 
              query={query}
              setQuery={setQuery}
              onRun={() => handleQueryExecute(query)}
              loading={solving}
              isRetroTheme={isRetroTheme}
            />
          </div>

          {queryResults && (
            <div className="crt-container p-4">
              <div className="text-sm mb-2 opacity-75">QUERY RESULTS:</div>
              <ResultsTable results={queryResults} isRetroTheme={isRetroTheme} />
            </div>
          )}

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div className="crt-container p-4">
              <div className="text-sm mb-2 opacity-75 flex justify-between items-center">
                <span>QUERY HISTORY:</span>
                <button 
                  onClick={() => setQueryHistory([])}
                  className="text-xs underline opacity-50 hover:opacity-100"
                >
                  clear
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {queryHistory.slice(-5).reverse().map((item, idx) => (
                  <div key={idx} className="border border-current p-2 text-xs">
                    <div className="opacity-50 mb-1">{item.timestamp}</div>
                    <pre className="whitespace-pre-wrap font-mono opacity-75">{item.query}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Case File & Clue Board */}
        <div className="flex flex-col space-y-4">
          {/* Clue Board */}
          <div className="crt-container p-4 relative">
            <div className="text-xl font-bold mb-4 text-glow">📋 CLUE BOARD</div>
            
            {/* Clue Reveal Animation Overlay */}
            {showClueReveal && revealingClue && (
              <div className="absolute inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-6 border-4 border-current">
                <div className="text-center">
                  <div className="text-sm mb-4 opacity-75">&gt; EVIDENCE FOUND... PRINTING...</div>
                  <div className="border-4 border-current p-6 polaroid-print">
                    <div className="polaroid-develop">
                      <div className="text-xs mb-2 opacity-50">╔═══════════════════╗</div>
                      <div className="text-lg font-bold mb-3 clue-decrypt">NEW CLUE UNLOCKED</div>
                      <div className="text-sm leading-relaxed clue-reveal-animation">
                        {revealingClue}
                      </div>
                      <div className="text-xs mt-2 opacity-50">╚═══════════════════╝</div>
                    </div>
                  </div>
                  <div className="text-xs mt-4 opacity-50 skip-animation-hint">
                    Press ENTER or SPACE to skip
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              {cluesUnlocked.length === 0 ? (
                <div className="text-sm opacity-50 italic">No clues discovered yet...</div>
              ) : (
                cluesUnlocked.map((clue, index) => (
                  <div 
                    key={index} 
                    className="border border-current p-2 text-sm evidence-glow slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="font-bold">CLUE #{index + 1}</div>
                    <div className="mt-1">{clue}</div>
                  </div>
                ))
              )}
            </div>
            
            {/* Case Closed Stamp */}
            {showCaseClosedStamp && isCaseClosed && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                <div className="case-closed-stamp stamp-impact text-6xl font-bold transform -rotate-12 opacity-90">
                  <div className="border-8 border-current px-8 py-4 bg-black">
                    <div className="text-glow">CASE</div>
                    <div className="text-glow">CLOSED</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SQL Quick Reference */}
          <div className="crt-container p-4">
            <div className="text-lg font-bold mb-3">SQL QUICK REFERENCE</div>
            <div className="space-y-2 text-xs">
              <div className="border border-current p-2">
                <div className="font-bold mb-1">Basic SELECT</div>
                <pre className="opacity-75 whitespace-pre-wrap break-words">SELECT col1, col2
FROM table;</pre>
              </div>
              <div className="border border-current p-2">
                <div className="font-bold mb-1">WHERE Filtering</div>
                <pre className="opacity-75 whitespace-pre-wrap break-words">WHERE col = 'val'
WHERE col LIKE '%...'
WHERE col BETWEEN
  x AND y</pre>
              </div>
              <div className="border border-current p-2">
                <div className="font-bold mb-1">JOIN Tables</div>
                <pre className="opacity-75 whitespace-pre-wrap break-words">FROM t1
JOIN t2 
  ON t1.id = t2.id</pre>
              </div>
              <div className="border border-current p-2">
                <div className="font-bold mb-1">ORDER BY</div>
                <pre className="opacity-75 whitespace-pre-wrap break-words">ORDER BY col
  ASC/DESC</pre>
              </div>
            </div>
          </div>

          {/* Schema Reference */}
          <div className="crt-container p-4 flex-1 overflow-auto">
            <div className="text-xl font-bold mb-4">DATABASE SCHEMA</div>
            <div className="space-y-3 text-sm">
              {Object.entries(caseSchema).map(([tableName, columns]) => (
                <div key={tableName} className="border border-current p-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold">▸ {tableName}</div>
                    <button
                      onClick={() => previewTable(tableName)}
                      className="text-xs opacity-75 hover:opacity-100 underline"
                    >
                      preview
                    </button>
                  </div>
                  {columns.map((col, idx) => (
                    <div key={idx} className="ml-3 opacity-75 text-xs">
                      {col.name} <span className="opacity-50">({col.type})</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Table Preview Modal */}
          {showTablePreview && tablePreview && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 fade-in">
              <div className="crt-container p-6 max-w-4xl w-full max-h-[80vh] overflow-auto slide-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">TABLE: {tablePreview.name}</h3>
                  <button
                    onClick={() => setShowTablePreview(false)}
                    className="terminal-button text-sm px-3 py-1"
                  >
                    ✕ CLOSE
                  </button>
                </div>
                <div className="text-xs mb-2 opacity-75">Showing first 5 rows:</div>
                <ResultsTable results={tablePreview.data} isRetroTheme={isRetroTheme} />
              </div>
            </div>
          )}

          {/* Case Status */}
          {isCaseClosed && (
            <div className="crt-container p-4 border-4 border-current">
              <div className="text-2xl font-bold text-center text-glow">
                ★ CASE CLOSED ★
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Clue Notification Toast */}
      {clueNotification && (
        <div className="fixed top-20 right-4 z-50 clue-notification">
          <div className="crt-container p-4 border-4 border-current min-w-[300px]">
            <div className="text-sm font-bold mb-2 text-glow">🔍 NEW CLUE DISCOVERED!</div>
            <div className="text-xs opacity-75">{clueNotification.substring(0, 50)}...</div>
          </div>
        </div>
      )}
      
      {/* Skip Animation Hint */}
      {(showClueReveal || narrativeTransition) && (
        <div className="skip-animation-hint">
          Press ENTER or SPACE to skip animation
        </div>
      )}
      
      <Footer isRetroTheme={isRetroTheme} />
    </div>
  );
};

export default DataDetective;
