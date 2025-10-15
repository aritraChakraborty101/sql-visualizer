import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Visualization = ({ steps, isRetroTheme = true }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousData, setPreviousData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  useEffect(() => {
    setCurrentStep(0);
    setPreviousData(null);
    setTypewriterComplete(false);
  }, [steps]);

  useEffect(() => {
    // Simulate typewriter delay
    setTypewriterComplete(false);
    const timer = setTimeout(() => setTypewriterComplete(true), 1000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  if (!steps || steps.length === 0) {
    return (
      <div className={isRetroTheme ? "crt-container rounded-lg p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-5"}>
        <h2 className={isRetroTheme 
          ? "text-xl font-bold mb-4 terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
          : "text-xl font-semibold mb-4 text-secondary border-b-2 border-primary pb-2"
        }>
          {isRetroTheme ? '&gt;&gt; QUERY EXECUTION VISUALIZER' : 'Query Execution Visualization'}
        </h2>
        <div className={isRetroTheme 
          ? "text-center terminal-text italic py-10 opacity-50"
          : "text-center text-gray-500 italic py-10"
        }>
          {isRetroTheme 
            ? <>[READY] RUN A QUERY TO INITIALIZE VISUALIZATION SEQUENCE...<span className="cursor-blink ml-2">▊</span></>
            : 'Run a query to see the step-by-step execution visualization'
          }
        </div>
      </div>
    );
  }

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setIsProcessing(true);
      setPreviousData(step.data);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsProcessing(false);
      }, 300);
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
    <div className={isRetroTheme ? "crt-container rounded-lg p-5 relative overflow-hidden" : "bg-white rounded-lg shadow-md p-5"}>
      <div className="flex justify-between items-center mb-5 relative z-20">
        <h2 className={isRetroTheme 
          ? "text-xl font-bold terminal-text text-glow border-b-2 border-green-500 pb-2 uppercase tracking-wider"
          : "text-xl font-semibold text-secondary border-b-2 border-primary pb-2"
        }>
          {isRetroTheme ? '&gt;&gt; EXECUTION VISUALIZER' : 'Query Execution Visualization'}
        </h2>
        <div className={isRetroTheme 
          ? "border-2 border-green-500 px-3 py-1.5 text-sm font-bold terminal-text"
          : "bg-gray-200 px-3 py-1.5 rounded-full text-sm font-semibold text-gray-600"
        }>
          {isRetroTheme ? `[STEP ${currentStep + 1}/${steps.length}]` : `Step ${currentStep + 1} of ${steps.length}`}
        </div>
      </div>

      <div className={`flex items-center gap-4 mb-5 p-4 ${isRetroTheme ? 'border border-green-500 rounded bg-black bg-opacity-50' : 'bg-gray-50 rounded-lg'} relative z-20`}>
        <button 
          onClick={handlePrevious} 
          disabled={isFirstStep}
          className={isRetroTheme ? "terminal-button text-xs" : "bg-primary hover:bg-cyan-400 text-secondary px-5 py-2.5 rounded font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"}
        >
          {isRetroTheme ? '← PREV' : '← Previous'}
        </button>
        
        <div className="flex gap-2 flex-1 justify-center items-center">
          {steps.map((_, index) => (
            <button
              key={index}
              className={isRetroTheme 
                ? `w-8 h-8 border-2 font-bold text-xs transition-all flex items-center justify-center
                  ${index === currentStep 
                    ? 'bg-green-500 text-black border-green-500 shadow-[0_0_10px_rgba(0,255,0,0.8)]' 
                    : index < currentStep 
                      ? 'bg-green-700 text-green-300 border-green-700' 
                      : 'bg-transparent text-green-500 border-green-700 hover:border-green-500'
                  }`
                : `w-9 h-9 rounded-full border-2 font-semibold text-sm transition-all flex items-center justify-center
                  ${index === currentStep 
                    ? 'bg-primary text-secondary border-primary scale-110' 
                    : index < currentStep 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:bg-blue-50'
                  }`
              }
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
          className={isRetroTheme ? "terminal-button text-xs" : "bg-primary hover:bg-cyan-400 text-secondary px-5 py-2.5 rounded font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"}
        >
          {isRetroTheme ? 'NEXT →' : 'Next →'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`mb-6 ${isRetroTheme ? 'border-2 border-green-500 rounded overflow-hidden shadow-[0_0_15px_rgba(0,255,0,0.3)]' : 'border border-gray-300 rounded-lg overflow-hidden'} relative z-20`}
        >
          <div className={isRetroTheme 
            ? "bg-black bg-opacity-80 px-4 py-3 border-b-2 border-green-500"
            : "bg-gray-50 px-4 py-3 border-b border-gray-300"
          }>
            <div className={isRetroTheme 
              ? "font-bold terminal-text text-glow mb-1 uppercase tracking-wide"
              : "font-semibold text-secondary mb-1"
            }>
              {step.title}
            </div>
            <div className={isRetroTheme 
              ? "terminal-text text-sm opacity-80"
              : "text-gray-600 text-sm"
            }>
              {isRetroTheme ? `> ${step.description}` : step.description}
            </div>
          </div>
          <div className={isRetroTheme ? "p-4 bg-black bg-opacity-60" : "p-4"}>
            {isProcessing ? (
              <div className={`text-center py-10 ${isRetroTheme ? 'terminal-text' : 'text-gray-500'}`}>
                <span className={isRetroTheme ? "processing-text text-lg font-bold" : ""}>
                  {isRetroTheme ? '' : 'Processing...'}
                </span>
                {isRetroTheme && <span className="cursor-blink ml-2">▊</span>}
              </div>
            ) : step.data && step.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse font-mono text-xs">
                    <thead className={isRetroTheme ? "bg-black" : "bg-secondary text-white"}>
                      <tr>
                        {Object.keys(step.data[0]).map((key, index) => (
                          <th 
                            key={key} 
                            className={isRetroTheme 
                              ? "py-2 px-3 text-left crt-table-cell font-bold uppercase text-glow"
                              : "py-2.5 px-3 text-left border border-gray-300"
                            }
                            style={isRetroTheme && !typewriterComplete ? {
                              animation: `reveal-char 0.05s ease-in ${index * 0.1}s both`
                            } : {}}
                          >
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
                              initial={status === 'added' ? { opacity: 0 } : {}}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                              className={isRetroTheme 
                                ? `${status === 'added' ? 'char-reveal' : ''} hover:bg-green-900 hover:bg-opacity-30`
                                : `even:bg-gray-50 hover:bg-blue-50 transition-all ${status === 'added' ? 'animate-added' : ''}`
                              }
                            >
                              {Object.values(row).map((value, cellIndex) => (
                                <td 
                                  key={cellIndex} 
                                  className={isRetroTheme ? "py-2 px-3 crt-table-cell" : "py-2.5 px-3 border border-gray-300"}
                                  style={isRetroTheme && status === 'added' && typewriterComplete ? {
                                    animation: `reveal-char 0.05s ease-in ${cellIndex * 0.05}s both`
                                  } : {}}
                                >
                                  {value !== null ? value : (isRetroTheme ? '<NULL>' : 'NULL')}
                                </td>
                              ))}
                            </motion.tr>
                          );
                        })}
                        {getRemovedRows().map((row, rowIndex) => (
                          <motion.tr
                            key={`removed-${rowIndex}`}
                            className={isRetroTheme ? "row-static-out" : "animate-removed"}
                            initial={isRetroTheme ? {} : { opacity: 1, backgroundColor: '#ffebee' }}
                            animate={isRetroTheme ? {} : { opacity: 0, height: 0 }}
                            exit={isRetroTheme ? {} : { opacity: 0, height: 0 }}
                            transition={isRetroTheme ? {} : { duration: 0.5 }}
                          >
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className={isRetroTheme ? "py-2 px-3 crt-table-cell" : "py-2.5 px-3 border border-gray-300"}>
                                {value !== null ? value : (isRetroTheme ? '<NULL>' : 'NULL')}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                <div className={isRetroTheme 
                  ? "mt-3 p-2 border border-green-700 rounded text-center text-xs terminal-text bg-black bg-opacity-50"
                  : "mt-3 p-2 bg-gray-50 rounded text-center text-xs text-gray-600"
                }>
                  {isRetroTheme 
                    ? `[${step.data.length} RECORD${step.data.length !== 1 ? 'S' : ''} IN BUFFER]`
                    : `${step.data.length} row${step.data.length !== 1 ? 's' : ''} in result`
                  }
                </div>
              </>
            ) : (
              <div className={`text-center py-10 ${isRetroTheme ? 'terminal-text italic opacity-50' : 'text-gray-500 italic'}`}>
                {isRetroTheme ? '[NO DATA AT THIS STEP]' : 'No data at this step'}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Visualization;
