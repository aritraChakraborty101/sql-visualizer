import React from 'react';

const LessonPanel = ({ lesson, onShowHint, hintVisible, isRetroTheme = true }) => {
  if (!lesson) {
    return null;
  }

  return (
    <div className={isRetroTheme ? "crt-container rounded-lg p-5 mb-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-5 mb-5"}>
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className={isRetroTheme 
              ? "text-lg font-bold terminal-text text-glow mb-1 uppercase tracking-wider"
              : "text-lg font-bold text-secondary mb-1"
            }>
              {lesson.title}
            </h3>
            <div className={isRetroTheme 
              ? "inline-block px-2 py-1 border border-yellow-500 text-yellow-400 text-xs font-bold uppercase tracking-wide"
              : "inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded"
            }>
              {isRetroTheme ? '[CHALLENGE MODE]' : 'Challenge Mode'}
            </div>
          </div>
        </div>
      </div>
      
      <div className={isRetroTheme 
        ? "mb-4 p-3 border-l-4 border-blue-500 bg-blue-900 bg-opacity-20 border-2 border-blue-700"
        : "mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded"
      }>
        <div className={isRetroTheme 
          ? "font-bold text-sm terminal-text text-blue-400 mb-1 uppercase tracking-wide"
          : "font-semibold text-sm text-blue-900 mb-1"
        }>
          {isRetroTheme ? '> OBJECTIVE:' : '🎯 Objective:'}
        </div>
        <div className={isRetroTheme ? "text-sm terminal-text" : "text-sm text-blue-800"}>
          {lesson.objective}
        </div>
      </div>
      
      <div className={isRetroTheme 
        ? "mb-4 p-3 border border-green-700 bg-black bg-opacity-40"
        : "mb-4 p-3 bg-gray-50 rounded"
      }>
        <div className={isRetroTheme 
          ? "font-bold text-sm terminal-text mb-1 uppercase tracking-wide"
          : "font-semibold text-sm text-gray-700 mb-1"
        }>
          {isRetroTheme ? '> EXPLANATION:' : '📖 Explanation:'}
        </div>
        <div className={isRetroTheme ? "text-sm terminal-text opacity-90" : "text-sm text-gray-700"}>
          {lesson.explanation}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onShowHint}
          className={isRetroTheme 
            ? "terminal-button text-sm border-yellow-500 text-yellow-500 hover:bg-yellow-500"
            : "px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded font-semibold transition-colors"
          }
        >
          {isRetroTheme ? '[[ SHOW HINT ]]' : '💡 Show Hint'}
        </button>
      </div>
      
      {hintVisible && lesson.hint && (
        <div className={isRetroTheme 
          ? "mt-3 p-3 border-2 border-yellow-500 bg-yellow-900 bg-opacity-20 animate-pulse"
          : "mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded animate-fadeIn"
        }>
          <div className={isRetroTheme 
            ? "font-bold text-sm text-yellow-400 mb-1 uppercase tracking-wide"
            : "font-semibold text-sm text-yellow-900 mb-1"
          }>
            {isRetroTheme ? '>> HINT:' : '💡 Hint:'}
          </div>
          <div className={isRetroTheme ? "text-sm text-yellow-300" : "text-sm text-yellow-800"}>
            {lesson.hint}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPanel;
