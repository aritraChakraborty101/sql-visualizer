import React, { useState } from 'react';
import './App.css';
import SchemaViewer from './components/SchemaViewer';
import SqlEditor from './components/SqlEditor';
import Visualization from './components/Visualization';
import ResultsTable from './components/ResultsTable';
import TipsPanel from './components/TipsPanel';
import LessonsSidebar from './components/LessonsSidebar';
import LessonPanel from './components/LessonPanel';

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

  const handleRunQuery = async () => {
    setError('');
    setLoading(true);
    setValidationFeedback(null);
    
    try {
      // If in lesson mode, validate against the lesson solution
      if (lessonMode && activeLesson) {
        const validateResponse = await fetch('http://127.0.0.1:5000/api/validate', {
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
      const response = await fetch('http://127.0.0.1:5000/api/query', {
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
    if (!lessonMode) {
      setActiveLesson(null);
      setValidationFeedback(null);
      setHintVisible(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-secondary text-white py-5 px-5 text-center shadow-md">
        <h1 className="text-3xl font-semibold">SQL Query Execution Visualizer</h1>
        <div className="mt-2">
          <button
            onClick={toggleLessonMode}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              lessonMode
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-primary hover:bg-cyan-400 text-secondary'
            }`}
          >
            {lessonMode ? '📖 Exit Lesson Mode' : '📚 Enter Lesson Mode'}
          </button>
        </div>
      </header>
      
      <div className="max-w-[1800px] mx-auto p-5">
        {lessonMode ? (
          // Lesson Mode Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1">
              <LessonsSidebar 
                onLessonSelect={handleLessonSelect}
                activeLesson={activeLesson}
                onToggleLessons={toggleLessonMode}
              />
            </div>
            
            <div className="lg:col-span-2 space-y-5">
              {activeLesson && (
                <LessonPanel
                  lesson={activeLesson}
                  onShowHint={() => setHintVisible(!hintVisible)}
                  hintVisible={hintVisible}
                />
              )}
              
              {validationFeedback && (
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
              )}
              
              <SqlEditor 
                query={query} 
                setQuery={setQuery} 
                onRun={handleRunQuery}
                loading={loading}
              />
              
              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded border-l-4 border-red-700">
                  {error}
                </div>
              )}
              
              {tips.length > 0 && <TipsPanel tips={tips} complexity={complexity} />}
              <Visualization steps={visualizationSteps} />
              <ResultsTable results={results} />
            </div>
          </div>
        ) : (
          // Free Query Mode Layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <SchemaViewer />
              <SqlEditor 
                query={query} 
                setQuery={setQuery} 
                onRun={handleRunQuery}
                loading={loading}
              />
              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded border-l-4 border-red-700">
                  {error}
                </div>
              )}
              {tips.length > 0 && <TipsPanel tips={tips} complexity={complexity} />}
            </div>
            
            <div className="flex flex-col gap-5">
              <Visualization steps={visualizationSteps} />
              <ResultsTable results={results} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
