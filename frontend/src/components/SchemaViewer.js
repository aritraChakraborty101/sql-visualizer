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
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2">
          Database Schema
        </h2>
        <div className="text-center text-gray-500 italic py-5">Loading schema...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2">
          Database Schema
        </h2>
        <div className="text-center text-red-700 bg-red-50 rounded p-5">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2">
        Database Schema
      </h2>
      <div className="font-mono text-sm">
        {schema && Object.entries(schema).map(([tableName, columns]) => (
          <div key={tableName} className="mb-5">
            <h3 className="text-primary mb-2 text-base font-semibold">{tableName}</h3>
            <ul className="pl-5 space-y-1">
              {columns.map((col) => (
                <li 
                  key={col.name} 
                  className={`flex items-center gap-2 ${col.pk ? 'text-pink-600 font-semibold' : 'text-gray-700'}`}
                >
                  <span>{col.name}</span>
                  <span className="text-gray-500 text-xs">({col.type})</span>
                  {col.pk && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-600 text-white font-bold">
                      PK
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaViewer;
