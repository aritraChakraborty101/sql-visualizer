import React from 'react';
import Editor from '@monaco-editor/react';

const SqlEditor = ({ query, setQuery, onRun, loading }) => {
  const sampleQueries = [
    'SELECT * FROM employees',
    'SELECT name, salary FROM employees WHERE salary > 80000',
    'SELECT e.name, e.salary, d.name as department FROM employees e INNER JOIN departments d ON e.department_id = d.id',
    'SELECT e.name, e.salary, d.name as dept FROM employees e LEFT JOIN departments d ON e.department_id = d.id WHERE e.salary > 70000 ORDER BY e.salary DESC',
    'SELECT d.name, COUNT(*) as emp_count, AVG(e.salary) as avg_salary FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name',
    'SELECT d.name, COUNT(*) as count FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name HAVING COUNT(*) > 1'
  ];

  const queryDescriptions = [
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
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2">
        SQL Query Editor
      </h2>
      <div 
        className="border-2 border-gray-300 rounded overflow-hidden mb-3" 
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
            fontSize: 14,
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
      <div className="flex gap-3 items-center mb-3">
        <button 
          onClick={onRun} 
          disabled={loading}
          className="flex items-center gap-3 bg-primary hover:bg-cyan-400 text-secondary px-6 py-3 rounded font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Executing...' : 'Run Query'}</span>
          <span className="text-xs opacity-70 font-normal bg-black bg-opacity-10 px-1.5 py-0.5 rounded">
            Ctrl+Enter
          </span>
        </button>
      </div>
      
      <div className="mt-3 p-3 bg-gray-50 rounded">
        <h4 className="text-sm mb-2 text-gray-600 font-semibold">Sample Queries (click to load):</h4>
        <div className="space-y-1.5">
          {sampleQueries.map((q, index) => (
            <button 
              key={index} 
              onClick={() => setQuery(q)}
              className="block w-full text-left px-3 py-2 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-primary transition-colors"
            >
              <div className="font-semibold text-xs text-gray-700 mb-1">
                {queryDescriptions[index]}
              </div>
              <div className="font-mono text-xs text-gray-600">
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
