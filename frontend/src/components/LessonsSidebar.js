import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const LessonsSidebar = ({ onLessonSelect, activeLesson, onToggleLessons, isRetroTheme = true }) => {
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    try {
      const response = await fetch(`${API_URL}/api/curriculum`);
      const data = await response.json();
      
      if (response.ok) {
        setCurriculum(data);
        // Expand first module by default
        if (data.modules && data.modules.length > 0) {
          setExpandedModules({ [data.modules[0].id]: true });
        }
      } else {
        setError(data.error || 'Failed to load curriculum');
      }
    } catch (err) {
      setError('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (loading) {
    return (
      <div className={isRetroTheme ? "crt-container rounded-lg p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-5"}>
        <h2 className={isRetroTheme 
          ? "text-xl font-bold mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
          : "text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2"
        }>
          {isRetroTheme ? '>> TRAINING MODULES' : '📚 Lessons'}
        </h2>
        <div className={isRetroTheme 
          ? "text-center terminal-text py-5"
          : "text-center text-gray-500 py-5"
        }>
          {isRetroTheme 
            ? <>LOADING MODULES<span className="cursor-blink ml-2">▊</span></>
            : 'Loading lessons...'
          }
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={isRetroTheme ? "crt-container rounded-lg p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-5"}>
        <h2 className={isRetroTheme 
          ? "text-xl font-bold mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
          : "text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2"
        }>
          {isRetroTheme ? '>> TRAINING MODULES' : '📚 Lessons'}
        </h2>
        <div className={isRetroTheme 
          ? "text-center terminal-text p-3 border-2 border-red-500 bg-red-900 bg-opacity-20"
          : "text-center text-red-700 bg-red-50 rounded p-3"
        }>
          {isRetroTheme ? '[[ ERROR ]] ' : ''}{error}
        </div>
      </div>
    );
  }

  return (
    <div className={isRetroTheme 
      ? "crt-container rounded-lg p-5 max-h-[600px] overflow-y-auto relative"
      : "bg-white rounded-lg shadow-md p-5 max-h-[600px] overflow-y-auto"
    }>
      <div className="flex justify-between items-center mb-4 border-b-2 border-green-500 pb-2">
        <h2 className={isRetroTheme 
          ? "text-xl font-bold terminal-text text-glow uppercase tracking-wider"
          : "text-xl font-semibold text-secondary"
        }>
          {isRetroTheme ? '>> TRAINING' : '📚 Lessons'}
        </h2>
        <button
          onClick={onToggleLessons}
          className={isRetroTheme 
            ? "text-sm terminal-text hover:text-green-400 border border-green-700 px-2 py-1"
            : "text-sm text-gray-600 hover:text-gray-800"
          }
        >
          {isRetroTheme ? '[HIDE]' : 'Hide'}
        </button>
      </div>
      
      {curriculum && curriculum.modules && curriculum.modules.map((module) => (
        <div key={module.id} className="mb-4">
          <button
            onClick={() => toggleModule(module.id)}
            className={isRetroTheme 
              ? "w-full text-left flex items-center justify-between p-3 border-2 border-green-700 bg-black bg-opacity-60 hover:bg-green-900 hover:bg-opacity-30 hover:border-green-500 font-bold text-sm transition-all terminal-text"
              : "w-full text-left flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded font-semibold text-sm transition-colors"
            }
          >
            <span className={isRetroTheme ? "uppercase tracking-wide" : ""}>{module.title}</span>
            <span className={isRetroTheme ? "text-green-400" : "text-primary"}>
              {expandedModules[module.id] ? '▼' : '▶'}
            </span>
          </button>
          
          {expandedModules[module.id] && (
            <div className="mt-2 ml-3 space-y-1">
              {module.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => onLessonSelect(lesson)}
                  className={isRetroTheme 
                    ? `w-full text-left px-3 py-2 text-sm transition-all font-mono ${
                        activeLesson?.id === lesson.id
                          ? 'bg-green-500 text-black font-bold border-2 border-green-400 shadow-[0_0_10px_rgba(0,255,0,0.6)]'
                          : 'bg-black bg-opacity-40 terminal-text hover:bg-green-900 hover:bg-opacity-30 border border-green-700'
                      }`
                    : `w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeLesson?.id === lesson.id
                          ? 'bg-primary text-secondary font-semibold'
                          : 'bg-white hover:bg-blue-50 border border-gray-200'
                      }`
                  }
                >
                  <div className="flex items-start gap-2">
                    <span className={isRetroTheme ? "opacity-70 min-w-[25px]" : "text-xs text-gray-500 min-w-[20px]"}>
                      {isRetroTheme ? `[${(index + 1).toString().padStart(2, '0')}]` : `${index + 1}.`}
                    </span>
                    <span className={isRetroTheme ? "uppercase tracking-wide" : ""}>{lesson.title}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {isRetroTheme && (
        <div className="mt-4 pt-4 border-t border-green-700 text-xs terminal-text opacity-50 text-center">
          [MODULES LOADED]
        </div>
      )}
    </div>
  );
};

export default LessonsSidebar;
