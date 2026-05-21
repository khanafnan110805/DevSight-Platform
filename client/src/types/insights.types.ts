export type InsightCategory =
  | 'productivity'
  | 'consistency'
  | 'language'
  | 'collaboration'
  | 'momentum'
  | 'streak';

export type InsightSentiment = 'positive' | 'neutral' | 'warning';

export type InsightPriority = 'high' | 'medium' | 'low';

export interface Insight {
  id: string;
  category: InsightCategory;
  sentiment: InsightSentiment;
  priority: InsightPriority;
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  generatedAt: string;
}

export interface ProductivityScore {
  total: number;           // 0–100
  breakdown: {
    consistency: number;   // 0–25
    volume: number;        // 0–25
    diversity: number;     // 0–25
    momentum: number;      // 0–25
  };
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  percentile: number;
}
