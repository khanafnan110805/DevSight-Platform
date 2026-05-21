import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { LanguageStat } from '@/types/dashboard.types';
import { useIsDark } from '@/hooks/useUtils';
import { formatPercentage } from '@/utils/format.utils';

interface LanguagePieChartProps {
  data: LanguageStat[];
  height?: number;
  showLegend?: boolean;
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: CustomLabelProps) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {formatPercentage(percent * 100, 0)}
    </text>
  );
};

export const LanguagePieChart = ({
  data,
  height = 240,
  showLegend = true,
}: LanguagePieChartProps) => {
  const isDark = useIsDark();

  if (!data.length) return null;

  const top = data.slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={top}
          cx="50%"
          cy="45%"
          innerRadius="45%"
          outerRadius="70%"
          paddingAngle={2}
          dataKey="percentage"
          labelLine={false}
          label={renderCustomLabel}
        >
          {top.map(entry => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: isDark ? '#1E293B' : '#fff',
            border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(v: number, _: string, props: { payload?: LanguageStat }) => [
            formatPercentage(v),
            props.payload?.name ?? '',
          ]}
        />
        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span style={{ color: isDark ? '#94A3B8' : '#6B7280', fontSize: 12 }}>
                {value}
              </span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};
