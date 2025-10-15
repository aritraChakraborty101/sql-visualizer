import React, { useState, useEffect } from 'react';

const LessonsSidebar = ({ onLessonSelect, activeLesson, onToggleLessons }) => {
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/curriculum');
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
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2">
          📚 Lessons
        </h2>
        <div className="text-center text-gray-500 py-5">Loading lessons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2">
          📚 Lessons
        </h2>
        <div className="text-center text-red-700 bg-red-50 rounded p-3">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-h-[600px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 border-b-2 border-primary pb-2">
        <h2 className="text-xl font-semibold text-secondary">📚 Lessons</h2>
        <button
          onClick={onToggleLessons}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Hide
        </button>
      </div>
      
      {curriculum && curriculum.modules && curriculum.modules.map((module) => (
        <div key={module.id} className="mb-4">
          <button
            onClick={() => toggleModule(module.id)}
            className="w-full text-left flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded font-semibold text-sm transition-colors"
          >
            <span>{module.title}</span>
            <span className="text-primary">
              {expandedModules[module.id] ? '▼' : '▶'}
            </span>
          </button>
          
          {expandedModules[module.id] && (
            <div className="mt-2 ml-3 space-y-1">
              {module.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => onLessonSelect(lesson)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeLesson?.id === lesson.id
                      ? 'bg-primary text-secondary font-semibold'
                      : 'bg-white hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 min-w-[20px]">
                      {index + 1}.
                    </span>
                    <span>{lesson.title}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LessonsSidebar;
