'use client';

import { AnalysisStats } from '@/lib/storage';

interface AnalysisStatsCardProps {
  stats: AnalysisStats;
}

export default function AnalysisStatsCard({ stats }: AnalysisStatsCardProps) {
  if (stats.total === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📊</span>
          분석 통계
        </h3>
        {stats.importantClues > 0 && (
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-bold">
            중요 단서 {stats.importantClues}개 발견!
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatItem
          label="전체 분석"
          value={stats.total}
          color="text-slate-600 dark:text-slate-300"
        />
        <StatItem
          label="중요 단서"
          value={stats.importantClues}
          color="text-blue-600 dark:text-blue-400"
          highlight
        />
        <StatItem
          label="단서 1"
          value={stats.clue01Count}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <StatItem
          label="단서 2"
          value={stats.clue02Count}
          color="text-amber-600 dark:text-amber-400"
        />
      </div>
    </div>
  );
}

function StatItem({ 
  label, 
  value, 
  color,
  highlight = false 
}: { 
  label: string; 
  value: number; 
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`text-center p-2 rounded-lg ${highlight ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-white/50 dark:bg-slate-800/50'}`}>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
        {label}
      </div>
    </div>
  );
}

