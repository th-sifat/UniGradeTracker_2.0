import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export default function CgpaChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
        No data yet to display chart
      </div>
    );
  }

  // Calculate SGPA for each semester
  const chartData = data.map((sem, index) => {
    return {
      name: sem.semesterName || `Sem ${index + 1}`,
      SGPA: parseFloat(sem.gpa.toFixed(2))
    };
  });

  // Pad data with empty entries to align bars to the left and keep them close together
  const minBars = 8;
  const paddedData = [...chartData];
  for (let i = chartData.length; i < minBars; i++) {
    paddedData.push({
      name: ' '.repeat(i + 1), // Unique empty names
      SGPA: null
    });
  }

  // Calculate dynamic min-width to support scrolling for many semesters
  const minWidth = Math.max(paddedData.length * 80, 500);

  // Colors for the bars as seen in screenshot
  const colors = ['#7EE8CE', '#A7D990', '#F4B084', '#93A4F1', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  return (
    <div className="h-64 w-full mt-4 overflow-x-auto overflow-y-hidden">
      <div style={{ minWidth: `${minWidth}px`, height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={paddedData} 
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dy={10}
              padding={{ left: 10, right: 10 }}
            />
          <YAxis 
            domain={[0, 4]} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            dx={-10}
            ticks={[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar 
            dataKey="SGPA" 
            radius={[8, 8, 0, 0]}
            barSize={45}
          >
            {paddedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
            <LabelList dataKey="SGPA" position="center" fill="#334155" fontSize={12} fontWeight={500} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
