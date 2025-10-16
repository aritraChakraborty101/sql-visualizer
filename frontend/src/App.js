import React, { useState, useEffect } from 'react';
import './App.css';
import SchemaViewer from './components/SchemaViewer';
import SqlEditor from './components/SqlEditor';
import Visualization from './components/Visualization';
import ResultsTable from './components/ResultsTable';
import TipsPanel from './components/TipsPanel';
import LessonsSidebar from './components/LessonsSidebar';
import LessonPanel from './components/LessonPanel';
import DataDetective from './components/DataDetective';
import Footer from './components/Footer';
import API_URL from './config';

function App() {
  const [query, setQuery] = useState('SELECT * FROM employees');
  const [results, setResults] = useState(null);
  const [visualizationSteps, setVisualizationSteps] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  
  const [tips, setTips] = useState([]);
  const [complexity, setComplexity] = useState(null);
  
  // Lesson mode state
  const [lessonMode, setLessonMode] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [validationFeedback, setValidationFeedback] = useState(null);
  
  // Data Detective mode state
  const [detectiveMode, setDetectiveMode] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sqlVisTheme') || 'normal';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sqlVisTheme', theme);
  }, [theme]);

  const themes = [
    { id: 'green-phosphor', name: '🟢 Green Phosphor', desc: 'Classic CRT' },
    { id: 'amber-terminal', name: '🟠 Amber Terminal', desc: 'Vintage Unix' },
    { id: 'blue-screen', name: '🔵 Blue Screen', desc: 'IBM Terminal' },
    { id: 'apple-ii', name: '🍏 Apple II', desc: 'Retro Apple' },
    { id: 'matrix', name: '💚 Matrix', desc: 'Digital Rain' },
    { id: 'normal', name: '⚪ Modern Mode', desc: 'Clean & Bright' }
  ];

  const handleRunQuery = async () => {
    setError('');
    setLoading(true);
    setValidationFeedback(null);
    
    try {
      // If in lesson mode, validate against the lesson solution
      if (lessonMode && activeLesson) {
        const validateResponse = await fetch(`${API_URL}/api/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query,
            lesson_id: activeLesson.id
          }),
        });

        const validateData = await validateResponse.json();
        setValidationFeedback(validateData);
      }

      // Execute the query normally to show results and visualization
      const response = await fetch(`${API_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
        setVisualizationSteps(data.visualization);
        setTips(data.tips || []);
        setComplexity(data.complexity || null);
      } else {
        setError(data.error || 'An error occurred');
        setResults(null);
        setVisualizationSteps([]);
        setTips([]);
        setComplexity(null);
      }
    } catch (err) {
      setError('Failed to connect to the backend. Make sure Flask server is running.');
      setResults(null);
      setVisualizationSteps([]);
      setTips([]);
      setComplexity(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
    setQuery(lesson.pre_filled_query);
    setHintVisible(false);
    setValidationFeedback(null);
    setError('');
    setResults(null);
    setVisualizationSteps([]);
    setTips([]);
  };

  const toggleLessonMode = () => {
    setLessonMode(!lessonMode);
    setDetectiveMode(false);
    if (!lessonMode) {
      setActiveLesson(null);
      setValidationFeedback(null);
      setHintVisible(false);
    }
  };

  const toggleDetectiveMode = () => {
    setDetectiveMode(!detectiveMode);
    setLessonMode(false);
    setActiveLesson(null);
    setValidationFeedback(null);
  };

  const isRetroTheme = theme !== 'normal';

  // If in detective mode, show the Data Detective interface
  if (detectiveMode) {
    return <DataDetective theme={theme} onExit={() => setDetectiveMode(false)} />;
  }

  return (
    <div className={`min-h-screen ${isRetroTheme ? 'bg-black' : 'bg-gray-100'}`}>
      <header className={isRetroTheme ? 'terminal-header py-3 sm:py-5 px-3 sm:px-5 text-center' : 'bg-secondary text-white py-3 sm:py-5 px-3 sm:px-5 text-center shadow-md'}>
        {isRetroTheme ? (
          <>
            <h1 className="text-sm sm:text-2xl md:text-3xl font-bold text-glow tracking-widest mb-1 overflow-x-auto">
              ╔═══════════════════════════════════════════════════╗
            </h1>
            <h1 className="text-sm sm:text-2xl md:text-3xl font-bold text-glow tracking-widest overflow-x-auto">
              ║  SQL QUERY EXECUTION VISUALIZER v1.0  ║
            </h1>
            <h1 className="text-sm sm:text-2xl md:text-3xl font-bold text-glow tracking-widest mt-1 overflow-x-auto">
              ╚═══════════════════════════════════════════════════╝
            </h1>
          </>
        ) : (
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">SQL Query Execution Visualizer</h1>
        )}
        
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* Theme Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className={`text-xs sm:text-sm font-bold ${isRetroTheme ? 'terminal-text uppercase tracking-wider' : 'text-gray-700'}`}>
              {isRetroTheme ? 'THEME:' : 'Theme:'}
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={`flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 sm:py-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isRetroTheme 
                  ? 'terminal-button bg-black' 
                  : 'bg-white text-gray-900 border-2 border-gray-300 rounded hover:border-primary focus:border-primary focus:outline-none'
              }`}
            >
              {themes.map(t => (
                <option key={t.id} value={t.id} className={isRetroTheme ? '' : 'text-gray-900 bg-white'}>
                  {t.name} - {t.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Lesson Mode Toggle */}
          <button
            onClick={toggleLessonMode}
            className={`w-full sm:w-auto text-xs sm:text-sm ${
              isRetroTheme 
                ? `terminal-button ${lessonMode ? 'bg-green-500 text-black' : ''}` 
                : `px-3 sm:px-4 py-1.5 sm:py-2 rounded font-semibold transition-colors ${
                    lessonMode
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-primary hover:bg-cyan-400 text-secondary'
                  }`
            }`}
          >
            {isRetroTheme 
              ? (lessonMode ? '[[ EXIT LESSON MODE ]]' : '[[ ENTER LESSON MODE ]]')
              : (lessonMode ? '📖 Exit Lesson Mode' : '📚 Enter Lesson Mode')
            }
          </button>

          {/* Data Detective Mode Toggle */}
          <button
            onClick={toggleDetectiveMode}
            className={`w-full sm:w-auto text-xs sm:text-sm ${
              isRetroTheme 
                ? 'terminal-button' 
                : 'px-3 sm:px-4 py-1.5 sm:py-2 rounded font-semibold transition-colors bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isRetroTheme 
              ? '[[ 🔍 DATA DETECTIVE ]]'
              : '🔍 Data Detective'
            }
          </button>
        </div>
        
        {isRetroTheme && (
          <div className="mt-2 text-xs terminal-text opacity-70">
            {lessonMode ? '&gt; TRAINING PROTOCOL ACTIVE' : '&gt; FREE QUERY MODE'}
          </div>
        )}
      </header>
      
      <div className="max-w-[1800px] mx-auto p-3 sm:p-5">
        {lessonMode ? (
          // Lesson Mode Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5">
            <div className="lg:col-span-1">
              <LessonsSidebar 
                onLessonSelect={handleLessonSelect}
                activeLesson={activeLesson}
                onToggleLessons={toggleLessonMode}
                isRetroTheme={isRetroTheme}
              />
            </div>
            
            <div className="lg:col-span-2 space-y-3 sm:space-y-5">
              {activeLesson && (
                <LessonPanel
                  lesson={activeLesson}
                  onShowHint={() => setHintVisible(!hintVisible)}
                  hintVisible={hintVisible}
                  isRetroTheme={isRetroTheme}
                />
              )}
              
              {validationFeedback && (
                isRetroTheme ? (
                  <div className={`p-4 border-2 crt-container ${
                    validationFeedback.is_correct
                      ? 'border-green-500'
                      : 'border-yellow-500'
                  }`}>
                    <div className="font-bold text-lg mb-2 terminal-text text-glow uppercase">
                      {validationFeedback.is_correct ? '[[ SUCCESS ]] ✓' : '[[ ERROR ]] ✗'}
                    </div>
                    <div className="terminal-text text-sm">&gt; {validationFeedback.feedback}</div>
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg border-2 ${
                    validationFeedback.is_correct
                      ? 'bg-green-50 border-green-500 text-green-800'
                      : 'bg-orange-50 border-orange-500 text-orange-800'
                  }`}>
                    <div className="font-bold text-lg mb-2">
                      {validationFeedback.is_correct ? '✅ Correct!' : '❌ Not Quite'}
                    </div>
                    <div>{validationFeedback.feedback}</div>
                  </div>
                )
              )}
              
              <SqlEditor 
                query={query} 
                setQuery={setQuery} 
                onRun={handleRunQuery}
                loading={loading}
                isRetroTheme={isRetroTheme}
              />
              
              {error && (
                isRetroTheme ? (
                  <div className="crt-container border-2 border-red-500 px-4 py-3">
                    <div className="terminal-text text-red-500">
                      [[ ERROR ]] {error}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded border-l-4 border-red-700">
                    {error}
                  </div>
                )
              )}
              
              {tips.length > 0 && <TipsPanel tips={tips} complexity={complexity} isRetroTheme={isRetroTheme} />}
              <Visualization steps={visualizationSteps} isRetroTheme={isRetroTheme} />
              <ResultsTable results={results} isRetroTheme={isRetroTheme} />
            </div>
          </div>
        ) : (
          // Free Query Mode Layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5">
            <div className="flex flex-col gap-3 sm:gap-5">
              <SchemaViewer isRetroTheme={isRetroTheme} />
              <SqlEditor 
                query={query} 
                setQuery={setQuery} 
                onRun={handleRunQuery}
                loading={loading}
                isRetroTheme={isRetroTheme}
              />
              {error && (
                isRetroTheme ? (
                  <div className="crt-container border-2 border-red-500 px-4 py-3">
                    <div className="terminal-text text-red-500">
                      [[ ERROR ]] {error}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded border-l-4 border-red-700">
                    {error}
                  </div>
                )
              )}
              {tips.length > 0 && <TipsPanel tips={tips} complexity={complexity} isRetroTheme={isRetroTheme} />}
            </div>
            
            <div className="flex flex-col gap-3 sm:gap-5">
              <Visualization steps={visualizationSteps} isRetroTheme={isRetroTheme} />
              <ResultsTable results={results} isRetroTheme={isRetroTheme} />
            </div>
          </div>
        )}
      </div>
      
      <Footer isRetroTheme={isRetroTheme} />
    </div>
  );
}

export default App;
