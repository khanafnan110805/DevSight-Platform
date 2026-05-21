import { LANGUAGE_COLORS, DEFAULT_LANGUAGE_COLOR } from '@/config/constants';

export const getLanguageColor = (language: string | null | undefined): string => {
  if (!language) return DEFAULT_LANGUAGE_COLOR;
  return LANGUAGE_COLORS[language] ?? DEFAULT_LANGUAGE_COLOR;
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

export const getContrastColor = (hexColor: string): 'white' | 'black' => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 'white';
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
};

export const getHeatmapColor = (level: number, isDark: boolean): string => {
  const lightColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  const darkColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  const colors = isDark ? darkColors : lightColors;
  return colors[Math.min(level, 4)];
};
