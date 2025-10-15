import React from 'react';

const ResultsTable = ({ results }) => {
  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2">
          Query Results
        </h2>
        <div className="text-center text-gray-500 italic py-10">
          No results yet. Run a query to see results.
        </div>
      </div>
    );
  }

  const { columns, rows } = results;

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2">
        Query Results ({rows.length} {rows.length === 1 ? 'row' : 'rows'})
      </h2>
      {rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs">
            <thead className="bg-secondary text-white">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="py-2.5 px-3 text-left border border-gray-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2.5 px-3 border border-gray-300">
                      {cell !== null ? cell : 'NULL'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 italic py-10">
          Query returned no rows
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
