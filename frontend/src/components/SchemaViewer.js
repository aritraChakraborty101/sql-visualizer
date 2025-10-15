import React from 'react';

const SchemaViewer = () => {
  const schema = {
    departments: [
      { name: 'id', type: 'INTEGER', primary: true },
      { name: 'name', type: 'TEXT', primary: false },
      { name: 'location', type: 'TEXT', primary: false }
    ],
    employees: [
      { name: 'id', type: 'INTEGER', primary: true },
      { name: 'name', type: 'TEXT', primary: false },
      { name: 'salary', type: 'INTEGER', primary: false },
      { name: 'department_id', type: 'INTEGER', primary: false, foreign: true }
    ]
  };

  return (
    <div className="schema-viewer">
      <h2>Database Schema</h2>
      <div className="schema-content">
        {Object.entries(schema).map(([tableName, columns]) => (
          <div key={tableName} className="table-schema">
            <h3>{tableName}</h3>
            <ul>
              {columns.map((col) => (
                <li key={col.name} className={col.primary ? 'column-primary' : col.foreign ? 'column-foreign' : ''}>
                  {col.name} ({col.type})
                  {col.primary && ' - PRIMARY KEY'}
                  {col.foreign && ' - FOREIGN KEY'}
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
