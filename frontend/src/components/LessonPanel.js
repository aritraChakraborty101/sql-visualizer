import React from 'react';

const LessonPanel = ({ lesson, onShowHint, hintVisible }) => {
  if (!lesson) {
    return null;
  }

  return (
    <div className="crt-container rounded-lg p-5 mb-5 relative overflow-hidden">
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold terminal-text text-glow mb-1 uppercase tracking-wider">
              {lesson.title}
            </h3>
            <div className="inline-block px-2 py-1 border border-yellow-500 text-yellow-400 text-xs font-bold uppercase tracking-wide">
              [CHALLENGE MODE]
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4 p-3 border-l-4 border-blue-500 bg-blue-900 bg-opacity-20 border-2 border-blue-700">
        <div className="font-bold text-sm terminal-text text-blue-400 mb-1 uppercase tracking-wide">
          &gt; OBJECTIVE:
        </div>
        <div className="text-sm terminal-text">{lesson.objective}</div>
      </div>
      
      <div className="mb-4 p-3 border border-green-700 bg-black bg-opacity-40">
        <div className="font-bold text-sm terminal-text mb-1 uppercase tracking-wide">
          &gt; EXPLANATION:
        </div>
        <div className="text-sm terminal-text opacity-90">{lesson.explanation}</div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onShowHint}
          className="terminal-button text-sm border-yellow-500 text-yellow-500 hover:bg-yellow-500"
        >
          [[ SHOW HINT ]]
        </button>
      </div>
      
      {hintVisible && lesson.hint && (
        <div className="mt-3 p-3 border-2 border-yellow-500 bg-yellow-900 bg-opacity-20 animate-pulse">
          <div className="font-bold text-sm text-yellow-400 mb-1 uppercase tracking-wide">
            &gt;&gt; HINT:
          </div>
          <div className="text-sm text-yellow-300">{lesson.hint}</div>
        </div>
      )}
    </div>
  );
};

export default LessonPanel;
