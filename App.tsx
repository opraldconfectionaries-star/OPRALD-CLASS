import React, { useState, useEffect, useRef } from 'react';
import { FileUploadState, AnalysisResult } from './types';
import { analyzeResume } from './services/geminiService';
import ScoreGauge from './components/ScoreGauge';
import SkillRadar from './components/SkillRadar';
import ActionPlan from './components/ActionPlan';

const SAMPLE_RESUME_TEXT = `
JOHN DOE
Mid-Level React Developer

EXPERIENCE
Frontend Developer | TechCorp | 2021 - Present
- Built dashboard interfaces using React and Redux.
- Implemented responsive designs using Tailwind CSS.
- Collaborated with backend teams to integrate REST APIs.
- Unit testing with Jest and React Testing Library.

Junior Web Developer | AgencyXYZ | 2019 - 2021
- Developed landing pages using HTML, CSS, and JavaScript.
- Maintained WordPress sites for small business clients.

SKILLS
- React, JavaScript (ES6), HTML5, CSS3
- Git, GitHub, VS Code
- Basic Node.js familiarity
`;

const App: React.FC = () => {
  const [fileState, setFileState] = useState<FileUploadState>({ file: null, previewUrl: null });
  const [targetRole, setTargetRole] = useState('');
  
  // Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Progressive Loading Simulation
  useEffect(() => {
    if (isAnalyzing) {
      const steps = [
        "Parsing Document Structure...",
        "Extracting Experience & Context...",
        "Benchmarking against Industry Standards...",
        "Identifying Critical Gaps...",
        "Generating Strategic Action Plan..."
      ];
      
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep(prev => {
           if (prev < steps.length - 1) return prev + 1;
           return prev;
        });
      }, 2500); // Move step every 2.5s

      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  // Auto-scroll to results when analysis is done
  useEffect(() => {
    if (analysis && !isAnalyzing && resultsRef.current) {
       // Small timeout to ensure DOM is fully rendered
       setTimeout(() => {
         resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }, 200);
    }
  }, [analysis, isAnalyzing]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== 'application/pdf') {
        setError("Please upload a valid PDF file.");
        return;
      }
      setFileState({
        file,
        previewUrl: URL.createObjectURL(file)
      });
      setError(null);
    }
  };

  const loadSampleData = () => {
      const file = new File([SAMPLE_RESUME_TEXT], "john_doe_sample_resume.txt", { type: "text/plain" });
      setFileState({
          file: file,
          previewUrl: null
      });
      setTargetRole("Senior Full Stack Engineer");
      setError(null);
  };

  const handleAnalyze = async () => {
    if (!fileState.file || !targetRole.trim()) {
      setError("Please upload a resume and enter a target role.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setError(null);

    try {
      const result = await analyzeResume(fileState.file, targetRole);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadingMessages = [
    "Reading Document...",
    "Understanding Context...",
    "Comparing Skills...",
    "Finding Gaps...",
    "Finalizing Report..."
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 print:pb-0 print:bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 bg-opacity-90 backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">AI Career Gap Analyzer</h1>
          </div>
          <div className="flex items-center space-x-4">
             {analysis && (
                 <button onClick={() => window.print()} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden md:block">
                    Print Report
                 </button>
             )}
             <a href="https://ai.google.dev/" target="_blank" rel="noreferrer" className="text-xs font-semibold bg-slate-100 px-3 py-1 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">
                Gemini 2.5 Flash
             </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:py-0">
        
        {/* Input Section - Hidden on Print */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-12 relative overflow-hidden print:hidden">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            
            {/* Left: File Upload */}
            <div className="md:col-span-5">
              <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">1. Upload Resume (PDF)</label>
              <div className={`group border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${fileState.file ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                   {fileState.file ? (
                     <>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                           <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <span className="text-sm font-bold text-slate-800 line-clamp-1">{fileState.file.name}</span>
                        <span className="text-xs text-indigo-500 mt-1 font-medium group-hover:underline">Change File</span>
                     </>
                   ) : (
                     <>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                             <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <span className="text-sm font-medium text-slate-600">Drop PDF or <span className="text-indigo-600">Browse</span></span>
                     </>
                   )}
                </label>
              </div>
              {/* Demo Mode Button */}
               <div className="mt-3 text-center">
                  <button 
                    onClick={loadSampleData}
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600 underline decoration-slate-300 underline-offset-2 transition-colors"
                  >
                    No resume? Try with a Sample Profile
                  </button>
               </div>
            </div>

            {/* Middle: Arrow */}
            <div className="hidden md:flex md:col-span-1 h-24 items-center justify-center text-slate-300">
               <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>

            {/* Right: Target Role & Analyze */}
            <div className="md:col-span-6 flex flex-col justify-between h-full">
               <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">2. Target Role</label>
                  <div className="relative">
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full pl-5 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {targetRole && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                      </div>
                  </div>
               </div>

               <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !fileState.file || !targetRole}
                className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all flex items-center justify-center relative overflow-hidden
                  ${isAnalyzing || !fileState.file || !targetRole 
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5'}`
                }
               >
                  {isAnalyzing ? (
                    <span className="flex items-center z-10">
                       <span className="flex h-3 w-3 relative mr-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="z-10">Generate Gap Analysis</span>
                  )}
               </button>
            </div>
          </div>
          {error && (
             <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm flex items-center animate-shake">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
             </div>
          )}
        </div>

        {/* Loading State Overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center print:hidden">
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-indigo-50 max-w-md w-full text-center">
                 <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <svg className="w-10 h-10 text-indigo-600 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full border-t-indigo-600 animate-spin"></div>
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">{loadingMessages[loadingStep]}</h3>
                 <p className="text-slate-500 text-sm mb-6">This semantic analysis uses Gemini Pro and may take up to 10 seconds.</p>
                 <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${(loadingStep + 1) * 20}%` }}
                    ></div>
                 </div>
              </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && !isAnalyzing && (
          <div ref={resultsRef} className="animate-fade-in-up space-y-8 print:animate-none">
            
            {/* Hero Summary */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden print:bg-none print:bg-white print:text-black print:border print:border-slate-900 print:shadow-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl print:hidden"></div>
                <div className="relative z-10">
                   <h2 className="text-3xl font-bold mb-4 print:text-slate-900">Analysis Report</h2>
                   <p className="text-indigo-100 text-lg leading-relaxed max-w-4xl font-light print:text-slate-700">
                      {analysis.summary}
                   </p>
                </div>
            </div>

            {/* Visualizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:block print:space-y-8">
                {/* Gauge - Takes 1 col */}
                <div className="md:col-span-1 h-full print:break-inside-avoid">
                   <ScoreGauge score={analysis.matchScore} />
                </div>

                {/* Radar - Takes 2 cols */}
                <div className="md:col-span-2 h-full print:break-inside-avoid">
                   <SkillRadar skills={analysis.skills} />
                </div>
            </div>

            {/* Critical Gaps Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 print:border-none print:p-0">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-red-500 rounded-full mr-3 print:hidden"></span>
                    Critical Skill Gaps
                </h3>
                <div className="space-y-4">
                {analysis.skills.filter(s => s.currentProficiency < s.requiredProficiency).slice(0, 4).map((skill, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 print:bg-white print:border-slate-300 print:break-inside-avoid">
                        <div className="mb-2 md:mb-0">
                            <h4 className="font-bold text-slate-800">{skill.skillName}</h4>
                            <p className="text-sm text-slate-500">{skill.gapReason}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-xs text-slate-400 uppercase font-bold">Gap Size</div>
                                <div className="text-red-500 font-bold">-{skill.requiredProficiency - skill.currentProficiency}%</div>
                            </div>
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden print:border print:border-slate-300">
                                <div className="h-full bg-red-500 print:bg-black" style={{ width: `${skill.requiredProficiency - skill.currentProficiency}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Interview Prep Section (New Feature) */}
            {analysis.interviewPrep && analysis.interviewPrep.length > 0 && (
                <div className="bg-indigo-900 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden print:bg-white print:text-black print:border print:border-slate-900 print:shadow-none print:break-inside-avoid">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 print:hidden"></div>
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-white/10 rounded-lg mr-3 print:hidden">
                             <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Interview Readiness</h3>
                            <p className="text-indigo-200 text-sm print:text-slate-600">Be ready for these specific questions based on your gaps.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analysis.interviewPrep.map((q, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 print:bg-white print:border-slate-300 print:text-black">
                                <p className="font-medium text-lg mb-3">"{q.question}"</p>
                                <div className="bg-black/20 p-3 rounded-lg print:bg-slate-100 print:border print:border-slate-200">
                                    <p className="text-xs text-indigo-200 uppercase font-bold mb-1 print:text-slate-500">Recruiter is looking for:</p>
                                    <p className="text-sm text-slate-100 print:text-slate-800">{q.expectedKeyPoints}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Plan */}
            <ActionPlan items={analysis.actionPlan} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;