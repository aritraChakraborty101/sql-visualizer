import React, { useState } from 'react';
import './App.css';
import SchemaViewer from './components/SchemaViewer';
import SqlEditor from './components/SqlEditor';
import Visualization from './components/Visualization';
import ResultsTable from './components/ResultsTable';

function App() {
  const [query, setQuery] = useState('SELECT * FROM employees');
  const [results, setResults] = useState(null);
  const [visualizationSteps, setVisualizationSteps] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunQuery = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
        setVisualizationSteps(data.visualization);
      } else {
        setError(data.error || 'An error occurred');
        setResults(null);
        setVisualizationSteps([]);
      }
    } catch (err) {
      setError('Failed to connect to the backend. Make sure Flask server is running.');
      setResults(null);
      setVisualizationSteps([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SQL Query Execution Visualizer</h1>
      </header>
      
      <div className="main-container">
        <div className="left-panel">
          <SchemaViewer />
          <SqlEditor 
            query={query} 
            setQuery={setQuery} 
            onRun={handleRunQuery}
            loading={loading}
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <div className="right-panel">
          <Visualization steps={visualizationSteps} />
          <ResultsTable results={results} />
        </div>
      </div>
    </div>
  );
}

export default App;
