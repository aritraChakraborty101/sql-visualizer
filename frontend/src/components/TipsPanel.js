import React from 'react';

const TipsPanel = ({ tips, complexity }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  const getTypeColor = (type) => {
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
  };

  const getComplexityColor = (level) => {
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
  };

  return (
    <div className="crt-container rounded-lg p-5 mb-5 relative overflow-hidden">
      <h3 className="text-lg font-bold mb-3 terminal-text text-glow uppercase tracking-wider">
        &gt;&gt; QUERY ANALYSIS
      </h3>
      
      {complexity && (
        <div className="mb-4 p-3 border border-green-700 rounded bg-black bg-opacity-40">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold terminal-text text-sm uppercase">COMPLEXITY LEVEL:</span>
            <span className={`font-bold text-lg ${getComplexityColor(complexity.level)}`}>
              [{complexity.level.toUpperCase()}]
            </span>
          </div>
          <div className="text-xs terminal-text">
            <span className="font-bold">SCORE: {complexity.score}</span>
            {complexity.factors && complexity.factors.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer hover:text-green-400 uppercase tracking-wide">
                  &gt; SCORE BREAKDOWN
                </summary>
                <ul className="mt-2 ml-4 space-y-1">
                  {complexity.factors.map((factor, idx) => (
                    <li key={idx} className="text-xs text-green-500">+ {factor}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h4 className="font-bold terminal-text text-sm uppercase tracking-wide">&gt; TIPS &amp; SUGGESTIONS:</h4>
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`p-3 border-2 bg-black bg-opacity-60 ${getTypeColor(tip.type)}`}
          >
            <div className="font-bold text-sm mb-1 uppercase">{tip.title}</div>
            <div className="text-sm opacity-90">{tip.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsPanel;
