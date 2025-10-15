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
    '01: BASIC SELECT',
    '02: WHERE FILTER',
    '03: INNER JOIN',
    '04: COMPLEX QUERY',
    '05: AGGREGATES',
    '06: HAVING CLAUSE'
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
    <div className="crt-container rounded-lg p-5 relative overflow-hidden">
      <h2 className="text-xl font-bold mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider">
        &gt;&gt; SQL QUERY EDITOR
      </h2>
      <div 
        className="border-2 border-green-500 rounded overflow-hidden mb-3 shadow-[0_0_10px_rgba(0,255,0,0.3)]" 
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
          className="terminal-button flex items-center gap-3"
        >
          <span>{loading ? 'EXECUTING...' : '[[ RUN QUERY ]]'}</span>
          {!loading && (
            <span className="text-xs opacity-70 font-normal border border-green-700 px-1.5 py-0.5">
              CTRL+ENTER
            </span>
          )}
          {loading && <span className="cursor-blink">▊</span>}
        </button>
      </div>
      
      <div className="mt-3 p-3 border border-green-700 rounded bg-black bg-opacity-40">
        <h4 className="text-sm mb-2 terminal-text font-bold uppercase tracking-wide">
          &gt; SAMPLE QUERIES [CLICK TO LOAD]:
        </h4>
        <div className="space-y-1.5">
          {sampleQueries.map((q, index) => (
            <button 
              key={index} 
              onClick={() => setQuery(q)}
              className="block w-full text-left px-3 py-2 border border-green-700 bg-black bg-opacity-60 hover:bg-green-900 hover:bg-opacity-30 hover:border-green-500 transition-all"
            >
              <div className="font-bold text-xs terminal-text mb-1">
                {queryDescriptions[index]}
              </div>
              <div className="font-mono text-xs text-green-500 opacity-80">
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
