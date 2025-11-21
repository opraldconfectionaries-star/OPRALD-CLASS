import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { SkillPoint } from '../types';

interface SkillRadarProps {
  skills: SkillPoint[];
}

const SkillRadar: React.FC<SkillRadarProps> = ({ skills }) => {
  // Take top 6 most critical skills to avoid cluttering the chart
  const chartData = skills.slice(0, 6).map(skill => ({
    subject: skill.skillName,
    You: skill.currentProficiency,
    Target: skill.requiredProficiency,
    fullMark: 100,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center h-full">
      <div className="w-full flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-700">Skill Gap Visualization</h3>
          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded font-medium">Proficiency %</span>
      </div>
      
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            {/* Target Area */}
            <Radar
              name="Role Requirement"
              dataKey="Target"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="#f1f5f9"
              fillOpacity={0.6}
            />
            
            {/* Candidate Area */}
            <Radar
              name="Your Profile"
              dataKey="You"
              stroke="#6366f1"
              strokeWidth={3}
              fill="#818cf8"
              fillOpacity={0.4}
            />
            
            <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                iconType="circle"
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 text-center mt-2 max-w-xs">
        The <span className="text-indigo-500 font-bold">purple area</span> should ideally cover or exceed the <span className="text-slate-400 font-bold">dashed area</span>.
      </p>
    </div>
  );
};

export default SkillRadar;
