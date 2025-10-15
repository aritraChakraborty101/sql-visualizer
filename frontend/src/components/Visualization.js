import React from 'react';

const Visualization = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return (
      <div className="visualization-container">
        <h2>Query Execution Visualization</h2>
        <div className="empty-state">
          Run a query to see the step-by-step execution visualization
        </div>
      </div>
    );
  }

  return (
    <div className="visualization-container">
      <h2>Query Execution Visualization</h2>
      {steps.map((step, index) => (
        <div key={index} className="visualization-step">
          <div className="step-header">
            <div className="step-title">{step.title}</div>
            <div className="step-description">{step.description}</div>
          </div>
          <div className="step-data">
            {step.data && step.data.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    {Object.keys(step.data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {step.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex}>{value !== null ? value : 'NULL'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">No data at this step</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Visualization;
