import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  
  let color = "#ef4444"; // Red
  if (score >= 50) color = "#eab308"; // Yellow
  if (score >= 75) color = "#10b981"; // Emerald

  const data = [
    {
      name: 'Score',
      value: score,
      fill: color,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
         <div className="h-full transition-all duration-1000" style={{ width: `${score}%`, backgroundColor: color }}></div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-700 mb-2 z-10">Match Score</h3>
      
      <div className="w-full h-[200px] -mt-4 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={20} 
            data={data} 
            startAngle={180} 
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
              label={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-0 text-center">
            <span className="text-5xl font-extrabold text-slate-800 tracking-tighter block">{score}</span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Out of 100</span>
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center max-w-[200px] z-10 -mt-4">
        {score > 80 ? "Excellent fit. Minor tweaks needed." : 
         score > 50 ? "Good potential. Focus on gaps." : 
         "Significant gaps identified."}
      </p>
    </div>
  );
};

export default ScoreGauge;
