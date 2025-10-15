import React from 'react';

const TipsPanel = ({ tips, complexity }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  const getTypeColor = (type) => {
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
  };

  const getComplexityColor = (level) => {
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
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-5">
      <h3 className="text-lg font-semibold mb-3 text-secondary">Query Analysis</h3>
      
      {complexity && (
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Complexity Level:</span>
            <span className={`font-bold ${getComplexityColor(complexity.level)}`}>
              {complexity.level}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-semibold">Score: {complexity.score}</span>
            {complexity.factors && complexity.factors.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer hover:text-gray-800">Score Breakdown</summary>
                <ul className="mt-2 ml-4 space-y-1">
                  {complexity.factors.map((factor, idx) => (
                    <li key={idx} className="text-xs">• {factor}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700 text-sm">💡 Tips & Suggestions:</h4>
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`p-3 rounded border ${getTypeColor(tip.type)}`}
          >
            <div className="font-semibold text-sm mb-1">{tip.title}</div>
            <div className="text-sm">{tip.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsPanel;
