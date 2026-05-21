import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ContributionWeek } from '@/types/github.types';
import { format, parseISO } from 'date-fns';
import { useIsDark } from '@/hooks/useUtils';

interface CommitActivityChartProps {
  weeks: ContributionWeek[];
  height?: number;
}

export const CommitActivityChart = ({
  weeks,
  height = 200,
}: CommitActivityChartProps) => {
  const isDark = useIsDark();

  const data = weeks.map(w => ({
    date: w.contributionDays[0]?.date ?? '',
    commits: w.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
  }));

  const gridColor = isDark ? '#334155' : '#F3F4F6';
  const textColor = isDark ? '#64748B' : '#9CA3AF';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: textColor }}
          tickLine={false}
          axisLine={false}
          tickFormatter={d => {
            try { return format(parseISO(d), 'MMM'); } catch { return ''; }
          }}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 11, fill: textColor }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
            borderRadius: 8,
            fontSize: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
          labelFormatter={d => {
            try { return format(parseISO(d as string), 'MMM d, yyyy'); } catch { return d; }
          }}
          formatter={(v: number) => [`${v} commits`, 'Week total']}
          cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 2' }}
        />
        <Area
          type="monotone"
          dataKey="commits"
          stroke="#6366F1"
          strokeWidth={2}
          fill="url(#commitGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#6366F1', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
