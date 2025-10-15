import React, { useState, useEffect } from 'react';

const ResultsTable = ({ results, isRetroTheme = true }) => {
  const [displayedRows, setDisplayedRows] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (results && results.rows.length > 0) {
      if (isRetroTheme) {
        setIsRevealing(true);
        setDisplayedRows([]);
        
        // Reveal rows one by one with a slight delay
        results.rows.forEach((row, index) => {
          setTimeout(() => {
            setDisplayedRows(prev => [...prev, row]);
            if (index === results.rows.length - 1) {
              setTimeout(() => setIsRevealing(false), 500);
            }
          }, index * 50); // 50ms delay between each row
        });
      } else {
        // No animation for normal mode
        setDisplayedRows(results.rows);
        setIsRevealing(false);
      }
    }
  }, [results, isRetroTheme]);

  if (!results) {
    return (
      <div className={isRetroTheme ? "crt-container rounded-lg p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-5"}>
        <h2 className={isRetroTheme 
          ? "text-xl font-bold mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
          : "text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2"
        }>
          {isRetroTheme ? '&gt;&gt; QUERY RESULTS' : 'Query Results'}
        </h2>
        <div className={isRetroTheme 
          ? "text-center terminal-text italic py-10 opacity-50"
          : "text-center text-gray-500 italic py-10"
        }>
          {isRetroTheme 
            ? <>[AWAITING QUERY EXECUTION...]<span className="cursor-blink ml-2">▊</span></>
            : 'No results yet. Run a query to see results.'
          }
        </div>
      </div>
    );
  }

  const { columns, rows } = results;

  // Generate ASCII border dynamically based on content width
  const generateBorder = (char) => {
    return char.repeat(80);
  };

  return (
    <div className={isRetroTheme ? "crt-container rounded-lg p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-5"}>
      <h2 className={isRetroTheme 
        ? "text-xl font-bold mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
        : "text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2"
      }>
        {isRetroTheme ? '&gt;&gt; FINAL QUERY RESULTS' : `Query Results (${rows.length} ${rows.length === 1 ? 'row' : 'rows'})`}
      </h2>
      
      {isRetroTheme && (
        <div className="mb-3 terminal-text text-sm">
          [RECORDS RETURNED: {rows.length}] 
          {isRevealing && <span className="ml-2 processing-text text-xs"></span>}
        </div>
      )}

      {rows.length > 0 ? (
        <div className="relative">
          {/* ASCII Top Border - Only for retro */}
          {isRetroTheme && (
            <div className="terminal-text text-xs mb-2 overflow-hidden whitespace-nowrap">
              ╔{generateBorder('═')}╗
            </div>
          )}

          <div className={isRetroTheme 
            ? "overflow-x-auto border-l-2 border-r-2 border-green-500 bg-black bg-opacity-60 p-3"
            : "overflow-x-auto"
          }>
            <table className="w-full border-collapse font-mono text-xs">
              <thead className={isRetroTheme ? "bg-black" : "bg-secondary text-white"}>
                <tr>
                  {columns.map((col, index) => (
                    <th 
                      key={index} 
                      className={isRetroTheme 
                        ? "py-2 px-3 text-left crt-table-cell font-bold uppercase text-glow border-b-2 border-green-500"
                        : "py-2.5 px-3 text-left border border-gray-300"
                      }
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedRows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className={isRetroTheme 
                      ? "hover:bg-green-900 hover:bg-opacity-30 transition-colors"
                      : "even:bg-gray-50 hover:bg-blue-50 transition-colors"
                    }
                    style={isRetroTheme ? {
                      animation: `reveal-char 0.2s ease-in ${rowIndex * 0.05}s both`
                    } : {}}
                  >
                    {row.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        className={isRetroTheme ? "py-2 px-3 crt-table-cell" : "py-2.5 px-3 border border-gray-300"}
                      >
                        {cell !== null ? cell : (isRetroTheme ? '<NULL>' : 'NULL')}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Show cursor while revealing */}
                {isRetroTheme && isRevealing && displayedRows.length < rows.length && (
                  <tr>
                    <td colSpan={columns.length} className="py-2 px-3 terminal-text">
                      <span className="cursor-blink">▊</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ASCII Bottom Border - Only for retro */}
          {isRetroTheme && (
            <div className="terminal-text text-xs mt-2 overflow-hidden whitespace-nowrap">
              ╚{generateBorder('═')}╝
            </div>
          )}

          {/* Terminal Footer */}
          {isRetroTheme && !isRevealing && (
            <div className="mt-3 p-2 border border-green-700 rounded text-center text-xs terminal-text bg-black bg-opacity-50">
              [END OF TRANSMISSION] - {rows.length} RECORD{rows.length !== 1 ? 'S' : ''} LOADED
            </div>
          )}
        </div>
      ) : (
        <div className={isRetroTheme 
          ? "text-center terminal-text italic py-10 opacity-50 border-2 border-green-700 rounded bg-black bg-opacity-40"
          : "text-center text-gray-500 italic py-10"
        }>
          {isRetroTheme ? (
            <>
              [QUERY RETURNED ZERO RECORDS]
              <div className="mt-2 text-xs">
                ╔{'═'.repeat(40)}╗<br/>
                ║ {'NO DATA AVAILABLE'.padEnd(40)} ║<br/>
                ╚{'═'.repeat(40)}╝
              </div>
            </>
          ) : 'Query returned no rows'}
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
