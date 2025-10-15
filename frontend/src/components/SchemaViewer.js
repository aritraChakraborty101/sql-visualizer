import React, { useState, useEffect } from 'react';

const SchemaViewer = () => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/schema');
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
      <div className="crt-container rounded-lg p-5 relative overflow-hidden">
        <h2 className="text-xl font-bold mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider">
          &gt;&gt; DATABASE SCHEMA
        </h2>
        <div className="text-center terminal-text italic py-5 opacity-50">
          LOADING SCHEMA DATA<span className="cursor-blink ml-2">▊</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crt-container rounded-lg p-5 relative overflow-hidden">
        <h2 className="text-xl font-bold mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider">
          &gt;&gt; DATABASE SCHEMA
        </h2>
        <div className="text-center terminal-text p-5 border-2 border-red-500 bg-red-900 bg-opacity-20">
          [[ ERROR ]] {error}
        </div>
      </div>
    );
  }

  return (
    <div className="crt-container rounded-lg p-5 relative overflow-hidden">
      <h2 className="text-xl font-bold mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider">
        &gt;&gt; DATABASE SCHEMA
      </h2>
      <div className="font-mono text-sm terminal-text">
        {schema && Object.entries(schema).map(([tableName, columns]) => (
          <div key={tableName} className="mb-5 border border-green-700 p-3 rounded bg-black bg-opacity-40">
            <h3 className="text-green-400 mb-2 text-base font-bold uppercase text-glow tracking-wide">
              TABLE: {tableName}
            </h3>
            <div className="pl-3 space-y-1">
              {columns.map((col) => (
                <div 
                  key={col.name} 
                  className={`flex items-center gap-2 ${col.pk ? 'text-yellow-400' : 'text-green-500'}`}
                >
                  <span className="font-bold">&gt;</span>
                  <span className="font-mono">{col.name}</span>
                  <span className="opacity-70 text-xs">({col.type})</span>
                  {col.pk && (
                    <span className="text-[10px] px-1.5 py-0.5 border border-yellow-400 text-yellow-400 font-bold">
                      [PK]
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs terminal-text opacity-50 text-center">
        [SCHEMA LOADED SUCCESSFULLY]
      </div>
    </div>
  );
};

export default SchemaViewer;
