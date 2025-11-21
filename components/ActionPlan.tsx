import React from 'react';
import { ActionItem } from '../types';

interface ActionPlanProps {
  items: ActionItem[];
}

const ActionPlan: React.FC<ActionPlanProps> = ({ items }) => {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, we'd show a toast here
  };

  const openSearch = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="mt-12 no-break">
      <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg print:hidden">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Strategic Action Plan</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 no-break"
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider border border-indigo-100">
                  Step {index + 1}
                </span>
                <span className="text-slate-400 text-xs flex items-center font-medium">
                  <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.estimatedTime}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{item.title}</h4>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                {item.description}
              </p>
              
              {item.learningResourceQuery && (
                  <button 
                    onClick={() => openSearch(item.learningResourceQuery)}
                    className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center mt-2 print:hidden"
                  >
                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     Find Learning Resources
                  </button>
              )}
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100 print:bg-white print:border-t-2">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Generator Prompt</p>
                    <button 
                        onClick={() => copyToClipboard(item.projectPrompt)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center transition-colors print:hidden"
                        title="Copy to clipboard"
                    >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        Copy
                    </button>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-600 italic font-mono relative group select-all">
                    "{item.projectPrompt}"
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionPlan;