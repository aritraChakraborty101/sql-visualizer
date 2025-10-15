import React from 'react';

const SqlEditor = ({ query, setQuery, onRun, loading }) => {
  const sampleQueries = [
    'SELECT * FROM employees',
    'SELECT name, salary FROM employees WHERE salary > 80000',
    'SELECT e.name, e.salary, d.name as department FROM employees e JOIN departments d ON e.department_id = d.id',
    'SELECT d.name, COUNT(*) as emp_count FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name',
    'SELECT * FROM employees ORDER BY salary DESC'
  ];

  return (
    <div className="sql-editor">
      <h2>SQL Query Editor</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your SELECT query here..."
        spellCheck="false"
      />
      <button onClick={onRun} disabled={loading}>
        {loading ? 'Executing...' : 'Run Query'}
      </button>
      
      <div className="sample-queries">
        <h4>Sample Queries (click to load):</h4>
        {sampleQueries.map((q, index) => (
          <button key={index} onClick={() => setQuery(q)}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SqlEditor;
