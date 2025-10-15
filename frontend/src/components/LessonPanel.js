import React from 'react';

const LessonPanel = ({ lesson, onShowHint, hintVisible }) => {
  if (!lesson) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-5">
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-secondary mb-1">
              {lesson.title}
            </h3>
            <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
              Challenge Mode
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <div className="font-semibold text-sm text-blue-900 mb-1">🎯 Objective:</div>
        <div className="text-sm text-blue-800">{lesson.objective}</div>
      </div>
      
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="font-semibold text-sm text-gray-700 mb-1">📖 Explanation:</div>
        <div className="text-sm text-gray-700">{lesson.explanation}</div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onShowHint}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded font-semibold transition-colors"
        >
          💡 Show Hint
        </button>
      </div>
      
      {hintVisible && lesson.hint && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded animate-fadeIn">
          <div className="font-semibold text-sm text-yellow-900 mb-1">💡 Hint:</div>
          <div className="text-sm text-yellow-800">{lesson.hint}</div>
        </div>
      )}
    </div>
  );
};

export default LessonPanel;
