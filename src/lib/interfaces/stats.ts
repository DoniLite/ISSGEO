type PeriodStats = {
  count: number;
  period: string;
  percentage: number;
};

type TimeRangeStats = {
  current: PeriodStats;
  previous: PeriodStats;
  growth: number;
  growthPercentage: number;
};

export type ActivityStats = {
  monthly: TimeRangeStats;
  weekly: TimeRangeStats;
  yearly: TimeRangeStats;
};
