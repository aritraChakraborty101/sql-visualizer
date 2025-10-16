import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const SchemaViewer = ({ isRetroTheme = true }) => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await fetch(`${API_URL}/api/schema`);
      const data = await response.json();
      
      if (response.ok) {
        setSchema(data);
      } else {
        setError(data.error || 'Failed to load schema');
      }
    } catch (err) {
      setError('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={isRetroTheme ? "crt-container rounded-lg p-3 sm:p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-3 sm:p-5"}>
        <h2 className={isRetroTheme 
          ? "text-lg sm:text-xl font-bold mb-3 sm:mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
          : "text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-secondary border-b-2 border-primary pb-2"
        }>
          {isRetroTheme ? '>> DATABASE SCHEMA' : 'Database Schema'}
        </h2>
        <div className={isRetroTheme 
          ? "text-center terminal-text italic py-5 opacity-50 text-xs sm:text-sm"
          : "text-center text-gray-500 italic py-5 text-xs sm:text-sm"
        }>
          {isRetroTheme 
            ? <>LOADING SCHEMA DATA<span className="cursor-blink ml-2">▊</span></>
            : 'Loading schema...'
          }
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={isRetroTheme ? "crt-container rounded-lg p-3 sm:p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-3 sm:p-5"}>
        <h2 className={isRetroTheme 
          ? "text-lg sm:text-xl font-bold mb-3 sm:mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
          : "text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-secondary border-b-2 border-primary pb-2"
        }>
          {isRetroTheme ? '>> DATABASE SCHEMA' : 'Database Schema'}
        </h2>
        <div className={isRetroTheme 
          ? "text-center terminal-text p-5 border-2 border-red-500 bg-red-900 bg-opacity-20"
          : "text-center text-red-700 bg-red-50 rounded p-5"
        }>
          {isRetroTheme ? '[[ ERROR ]] ' : ''}{error}
        </div>
      </div>
    );
  }

  return (
    <div className={isRetroTheme ? "crt-container rounded-lg p-3 sm:p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-3 sm:p-5"}>
      <h2 className={isRetroTheme 
        ? "text-lg sm:text-xl font-bold mb-3 sm:mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
        : "text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-secondary border-b-2 border-primary pb-2"
      }>
        {isRetroTheme ? '>> DATABASE SCHEMA' : 'Database Schema'}
      </h2>
      <div className="font-mono text-xs sm:text-sm">
        {schema && Object.entries(schema).map(([tableName, columns]) => (
          <div key={tableName} className={isRetroTheme 
            ? "mb-4 sm:mb-5 border border-green-700 p-2 sm:p-3 rounded bg-black bg-opacity-40"
            : "mb-4 sm:mb-5"
          }>
            <h3 className={isRetroTheme 
              ? "text-green-400 mb-2 text-sm sm:text-base font-bold uppercase text-glow tracking-wide"
              : "text-primary mb-2 text-sm sm:text-base font-semibold"
            }>
              {isRetroTheme ? 'TABLE: ' : ''}{tableName}
            </h3>
            <div className="pl-2 sm:pl-3 space-y-1">
              {columns.map((col) => (
                <div 
                  key={col.name} 
                  className={`flex items-center gap-1 sm:gap-2 flex-wrap ${
                    isRetroTheme 
                      ? (col.pk ? 'text-yellow-400' : 'text-green-500')
                      : (col.pk ? 'text-pink-600 font-semibold' : 'text-gray-700')
                  }`}
                >
                  {isRetroTheme && <span className="font-bold">&gt;</span>}
                  <span className="font-mono">{col.name}</span>
                  <span className={isRetroTheme ? "opacity-70 text-[10px] sm:text-xs" : "text-gray-500 text-[10px] sm:text-xs"}>({col.type})</span>
                  {col.pk && (
                    <span className={isRetroTheme 
                      ? "text-[10px] px-1 sm:px-1.5 py-0.5 border border-yellow-400 text-yellow-400 font-bold"
                      : "text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-pink-600 text-white font-bold"
                    }>
                      {isRetroTheme ? '[PK]' : 'PK'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {isRetroTheme && (
        <div className="mt-3 text-xs terminal-text opacity-50 text-center">
          [SCHEMA LOADED SUCCESSFULLY]
        </div>
      )}
    </div>
  );
};

export default SchemaViewer;
