import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Visualization = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousData, setPreviousData] = useState(null);

  useEffect(() => {
    setCurrentStep(0);
    setPreviousData(null);
  }, [steps]);

  if (!steps || steps.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2">
          Query Execution Visualization
        </h2>
        <div className="text-center text-gray-500 italic py-10">
          Run a query to see the step-by-step execution visualization
        </div>
      </div>
    );
  }

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setPreviousData(step.data);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setPreviousData(steps[currentStep - 2]?.data || null);
      setCurrentStep(currentStep - 1);
    }
  };

  const getRowStatus = (row) => {
    if (!previousData || !step.data) return 'normal';
    
    const currentRowString = JSON.stringify(row);
    const wasInPrevious = previousData.some(
      prevRow => JSON.stringify(prevRow) === currentRowString
    );
    const isInCurrent = step.data.some(
      currRow => JSON.stringify(currRow) === currentRowString
    );

    if (!wasInPrevious && isInCurrent) return 'added';
    if (wasInPrevious && !isInCurrent) return 'removed';
    return 'normal';
  };

  const getRemovedRows = () => {
    if (!previousData || !step.data) return [];
    return previousData.filter(prevRow => {
      const prevRowString = JSON.stringify(prevRow);
      return !step.data.some(currRow => JSON.stringify(currRow) === prevRowString);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-secondary border-b-2 border-primary pb-2">
          Query Execution Visualization
        </h2>
        <div className="bg-gray-200 px-3 py-1.5 rounded-full text-sm font-semibold text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 rounded-lg">
        <button 
          onClick={handlePrevious} 
          disabled={isFirstStep}
          className="bg-primary hover:bg-cyan-400 text-secondary px-5 py-2.5 rounded font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        <div className="flex gap-2 flex-1 justify-center items-center">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`w-9 h-9 rounded-full border-2 font-semibold text-sm transition-all flex items-center justify-center
                ${index === currentStep 
                  ? 'bg-primary text-secondary border-primary scale-110' 
                  : index < currentStep 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:bg-blue-50'
                }`}
              onClick={() => {
                setPreviousData(index > 0 ? steps[index - 1].data : null);
                setCurrentStep(index);
              }}
              title={steps[index].title}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleNext} 
          disabled={isLastStep}
          className="bg-primary hover:bg-cyan-400 text-secondary px-5 py-2.5 rounded font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6 border border-gray-300 rounded-lg overflow-hidden"
        >
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
            <div className="font-semibold text-secondary mb-1">{step.title}</div>
            <div className="text-gray-600 text-sm">{step.description}</div>
          </div>
          <div className="p-4">
            {step.data && step.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse font-mono text-xs">
                    <thead className="bg-secondary text-white">
                      <tr>
                        {Object.keys(step.data[0]).map((key) => (
                          <th key={key} className="py-2.5 px-3 text-left border border-gray-300">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {step.data.map((row, rowIndex) => {
                          const status = getRowStatus(row);
                          return (
                            <motion.tr
                              key={JSON.stringify(row)}
                              initial={status === 'added' ? { backgroundColor: '#e8f5e9', opacity: 0 } : {}}
                              animate={{ backgroundColor: 'transparent', opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className={`even:bg-gray-50 hover:bg-blue-50 transition-all ${
                                status === 'added' ? 'animate-added' : ''
                              }`}
                            >
                              {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex} className="py-2.5 px-3 border border-gray-300">
                                  {value !== null ? value : 'NULL'}
                                </td>
                              ))}
                            </motion.tr>
                          );
                        })}
                        {getRemovedRows().map((row, rowIndex) => (
                          <motion.tr
                            key={`removed-${rowIndex}`}
                            initial={{ opacity: 1, backgroundColor: '#ffebee' }}
                            animate={{ opacity: 0, height: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5 }}
                            className="animate-removed"
                          >
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="py-2.5 px-3 border border-gray-300">
                                {value !== null ? value : 'NULL'}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 p-2 bg-gray-50 rounded text-center text-xs text-gray-600">
                  {step.data.length} row{step.data.length !== 1 ? 's' : ''} in result
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 italic py-10">No data at this step</div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Visualization;
