import React from 'react';

const TipsPanel = ({ tips, complexity, isRetroTheme = true }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  const getTypeColor = (type, retro) => {
    if (retro) {
      switch (type) {
        case 'best_practice':
          return 'border-blue-500 text-blue-400';
        case 'performance':
          return 'border-yellow-500 text-yellow-400';
        case 'readability':
          return 'border-purple-500 text-purple-400';
        case 'warning':
          return 'border-red-500 text-red-400';
        case 'correctness':
          return 'border-orange-500 text-orange-400';
        case 'knowledge':
          return 'border-green-400 text-green-400';
        default:
          return 'border-gray-500 text-gray-400';
      }
    } else {
      switch (type) {
        case 'best_practice':
          return 'bg-blue-50 border-blue-200 text-blue-800';
        case 'performance':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'readability':
          return 'bg-purple-50 border-purple-200 text-purple-800';
        case 'warning':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'correctness':
          return 'bg-orange-50 border-orange-200 text-orange-800';
        case 'knowledge':
          return 'bg-green-50 border-green-200 text-green-800';
        default:
          return 'bg-gray-50 border-gray-200 text-gray-800';
      }
    }
  };

  const getComplexityColor = (level, retro) => {
    if (retro) {
      switch (level) {
        case 'Beginner':
          return 'text-green-400';
        case 'Intermediate':
          return 'text-blue-400';
        case 'Advanced':
          return 'text-orange-400';
        case 'Expert':
          return 'text-red-400';
        default:
          return 'text-gray-400';
      }
    } else {
      switch (level) {
        case 'Beginner':
          return 'text-green-600';
        case 'Intermediate':
          return 'text-blue-600';
        case 'Advanced':
          return 'text-orange-600';
        case 'Expert':
          return 'text-red-600';
        default:
          return 'text-gray-600';
      }
    }
  };

  return (
    <div className={isRetroTheme ? "crt-container rounded-lg p-5 mb-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-5 mb-5"}>
      <h3 className={isRetroTheme 
        ? "text-lg font-bold mb-3 terminal-text text-glow uppercase tracking-wider"
        : "text-lg font-semibold mb-3 text-secondary"
      }>
        {isRetroTheme ? '>> QUERY ANALYSIS' : 'Query Analysis'}
      </h3>
      
      {complexity && (
        <div className={isRetroTheme 
          ? "mb-4 p-3 border border-green-700 rounded bg-black bg-opacity-40"
          : "mb-4 p-3 bg-gray-50 rounded border border-gray-200"
        }>
          <div className="flex justify-between items-center mb-2">
            <span className={isRetroTheme 
              ? "font-bold terminal-text text-sm uppercase"
              : "font-semibold text-gray-700"
            }>
              {isRetroTheme ? 'COMPLEXITY LEVEL:' : 'Complexity Level:'}
            </span>
            <span className={`font-bold ${isRetroTheme ? 'text-lg' : ''} ${getComplexityColor(complexity.level, isRetroTheme)}`}>
              {isRetroTheme ? `[${complexity.level.toUpperCase()}]` : complexity.level}
            </span>
          </div>
          <div className={isRetroTheme ? "text-xs terminal-text" : "text-xs text-gray-600"}>
            <span className="font-bold">{isRetroTheme ? 'SCORE:' : 'Score:'} {complexity.score}</span>
            {complexity.factors && complexity.factors.length > 0 && (
              <details className="mt-2">
                <summary className={isRetroTheme 
                  ? "cursor-pointer hover:text-green-400 uppercase tracking-wide"
                  : "cursor-pointer hover:text-gray-800"
                }>
                  {isRetroTheme ? '> SCORE BREAKDOWN' : 'Score Breakdown'}
                </summary>
                <ul className="mt-2 ml-4 space-y-1">
                  {complexity.factors.map((factor, idx) => (
                    <li key={idx} className={isRetroTheme ? "text-xs text-green-500" : "text-xs"}>
                      {isRetroTheme ? '+' : '•'} {factor}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h4 className={isRetroTheme 
          ? "font-bold terminal-text text-sm uppercase tracking-wide"
          : "font-semibold text-gray-700 text-sm"
        }>
          {isRetroTheme ? '> TIPS & SUGGESTIONS:' : '💡 Tips & Suggestions:'}
        </h4>
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`p-3 ${isRetroTheme ? 'border-2 bg-black bg-opacity-60' : 'rounded border'} ${getTypeColor(tip.type, isRetroTheme)}`}
          >
            <div className={`font-bold text-sm mb-1 ${isRetroTheme ? 'uppercase' : ''}`}>{tip.title}</div>
            <div className={`text-sm ${isRetroTheme ? 'opacity-90' : ''}`}>{tip.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsPanel;
