import React from 'react';
import Editor from '@monaco-editor/react';

const SqlEditor = ({ query, setQuery, onRun, loading, isRetroTheme = true }) => {
  const sampleQueries = [
    'SELECT * FROM employees',
    'SELECT name, salary FROM employees WHERE salary > 80000',
    'SELECT e.name, e.salary, d.name as department FROM employees e INNER JOIN departments d ON e.department_id = d.id',
    'SELECT e.name, e.salary, d.name as dept FROM employees e LEFT JOIN departments d ON e.department_id = d.id WHERE e.salary > 70000 ORDER BY e.salary DESC',
    'SELECT d.name, COUNT(*) as emp_count, AVG(e.salary) as avg_salary FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name',
    'SELECT d.name, COUNT(*) as count FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name HAVING COUNT(*) > 1'
  ];

  const queryDescriptions = isRetroTheme ? [
    '01: BASIC SELECT',
    '02: WHERE FILTER',
    '03: INNER JOIN',
    '04: COMPLEX QUERY',
    '05: AGGREGATES',
    '06: HAVING CLAUSE'
  ] : [
    'Basic SELECT - Get all employees',
    'WHERE Clause - Filter by salary',
    'INNER JOIN - Employees with departments',
    'LEFT JOIN + WHERE + ORDER BY - Complex query',
    'GROUP BY with Aggregates - Count and average by department',
    'GROUP BY + HAVING - Departments with multiple employees'
  ];

  const handleEditorChange = (value) => {
    setQuery(value || '');
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to run query
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
  };

  return (
    <div className={isRetroTheme ? "crt-container rounded-lg p-3 sm:p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-3 sm:p-5"}>
      <h2 className={isRetroTheme 
        ? "text-lg sm:text-xl font-bold mb-3 sm:mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
        : "text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-secondary border-b-2 border-primary pb-2"
      }>
        {isRetroTheme ? '>> SQL QUERY EDITOR' : 'SQL Query Editor'}
      </h2>
      <div 
        className={isRetroTheme 
          ? "border-2 border-green-500 rounded overflow-hidden mb-3 shadow-[0_0_10px_rgba(0,255,0,0.3)]"
          : "border-2 border-gray-300 rounded overflow-hidden mb-3"
        }
        onKeyDown={handleKeyDown}
      >
        <Editor
          height="200px"
          defaultLanguage="sql"
          value={query}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
          }}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-3">
        <button 
          onClick={onRun} 
          disabled={loading}
          className={isRetroTheme 
            ? "terminal-button flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            : "flex items-center justify-center gap-2 sm:gap-3 bg-primary hover:bg-cyan-400 text-secondary px-4 sm:px-6 py-2 sm:py-3 rounded font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
          }
        >
          <span>{loading ? (isRetroTheme ? 'EXECUTING...' : 'Executing...') : (isRetroTheme ? '[[ RUN QUERY ]]' : 'Run Query')}</span>
          {!loading && (
            <span className={isRetroTheme 
              ? "text-xs opacity-70 font-normal border border-green-700 px-1.5 py-0.5"
              : "text-xs opacity-70 font-normal bg-black bg-opacity-10 px-1.5 py-0.5 rounded"
            }>
              {isRetroTheme ? 'CTRL+ENTER' : 'Ctrl+Enter'}
            </span>
          )}
          {loading && isRetroTheme && <span className="cursor-blink">▊</span>}
        </button>
      </div>
      
      <div className={isRetroTheme 
        ? "mt-3 p-2 sm:p-3 border border-green-700 rounded bg-black bg-opacity-40"
        : "mt-3 p-2 sm:p-3 bg-gray-50 rounded"
      }>
        <h4 className={isRetroTheme 
          ? "text-xs sm:text-sm mb-2 terminal-text font-bold uppercase tracking-wide"
          : "text-xs sm:text-sm mb-2 text-gray-600 font-semibold"
        }>
          {isRetroTheme ? '> SAMPLE QUERIES [CLICK TO LOAD]:' : 'Sample Queries (click to load):'}
        </h4>
        <div className="space-y-1.5">
          {sampleQueries.map((q, index) => (
            <button 
              key={index} 
              onClick={() => setQuery(q)}
              className={isRetroTheme 
                ? "block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 border border-green-700 bg-black bg-opacity-60 hover:bg-green-900 hover:bg-opacity-30 hover:border-green-500 transition-all"
                : "block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-primary transition-colors"
              }
            >
              <div className={isRetroTheme 
                ? "font-bold text-xs terminal-text mb-1"
                : "font-semibold text-xs text-gray-700 mb-1"
              }>
                {queryDescriptions[index]}
              </div>
              <div className={isRetroTheme 
                ? "font-mono text-xs text-green-500 opacity-80 break-all"
                : "font-mono text-xs text-gray-600 break-all"
              }>
                {q}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SqlEditor;
