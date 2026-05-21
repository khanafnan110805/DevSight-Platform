import {
  format,
  formatDistanceToNow,
  parseISO,
  differenceInDays,
  isToday,
  isYesterday,
  subDays,
  eachDayOfInterval,
} from 'date-fns';

export const formatDate = (dateStr: string, pattern = 'MMM d, yyyy') => {
  try {
    return format(parseISO(dateStr), pattern);
  } catch {
    return dateStr;
  }
};

export const formatRelativeDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr: string) => formatDate(dateStr, 'MMM d');

export const getDaysAgo = (dateStr: string): number => {
  try {
    return differenceInDays(new Date(), parseISO(dateStr));
  } catch {
    return 0;
  }
};

export const getLast52Weeks = (): Date[] => {
  const end = new Date();
  const start = subDays(end, 364);
  return eachDayOfInterval({ start, end });
};

export const getMonthLabel = (dateStr: string) => format(parseISO(dateStr), 'MMM');

export const groupByMonth = <T extends { date: string }>(
  items: T[]
): Record<string, T[]> => {
  return items.reduce(
    (acc, item) => {
      const month = format(parseISO(item.date), 'yyyy-MM');
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
};
