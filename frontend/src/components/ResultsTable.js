import React from 'react';

const ResultsTable = ({ results }) => {
  if (!results) {
    return (
      <div className="results-container">
        <h2>Query Results</h2>
        <div className="empty-state">
          No results yet. Run a query to see results.
        </div>
      </div>
    );
  }

  const { columns, rows } = results;

  return (
    <div className="results-container">
      <h2>Query Results ({rows.length} {rows.length === 1 ? 'row' : 'rows'})</h2>
      {rows.length > 0 ? (
        <table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell !== null ? cell : 'NULL'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">Query returned no rows</div>
      )}
    </div>
  );
};

export default ResultsTable;
