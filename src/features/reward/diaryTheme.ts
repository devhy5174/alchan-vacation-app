import type { DiaryTheme } from '../../types/reward';

export interface DiaryThemeColors {
  notebookBg: string;
  lines: string;
  todayBadgeBg: string;
  otherBadgeBg: string;
  ringTodayFront: string;
  ringTodayBack: string;
  ringOtherFront: string;
  ringOtherBack: string;
  checkDone: string;
  gaugeFill: string;
  gaugeDoneFill: string;
  gaugeBg: string;
  gaugeBarBg: string;
  gaugeDoneBarBg: string;
  borderToday: string;
  ringToday: string;
  borderOther: string;
  isRainbow?: boolean;
}

export const THEME_COLORS: Record<DiaryTheme, DiaryThemeColors> = {
  orange: {
    // 당근: 파란 진행 + 초록 완료
    notebookBg: '#f8faff',
    lines: '#bfdbfe',
    todayBadgeBg: '#fb923c',
    otherBadgeBg: '#38bdf8',
    ringTodayFront: '#fb923c',
    ringTodayBack: '#fed7aa',
    ringOtherFront: '#9ca3af',
    ringOtherBack: '#e5e7eb',
    checkDone: '#fb923c',
    gaugeFill: '#38bdf8',
    gaugeDoneFill: '#10b981',
    gaugeBg: '#e0f2fe',
    gaugeBarBg: '#f0f7ff',
    gaugeDoneBarBg: '#ecfdf5',
    borderToday: '#7dd3fc',
    ringToday: '#bae6fd',
    borderOther: '#bae6fd',
  },
  blue: {
    // 하늘 + 레몬: 스카이 진행 + 레몬노랑 완료
    notebookBg: '#f0f9ff',
    lines: '#bae6fd',
    todayBadgeBg: '#0ea5e9',
    otherBadgeBg: '#38bdf8',
    ringTodayFront: '#0ea5e9',
    ringTodayBack: '#bae6fd',
    ringOtherFront: '#38bdf8',
    ringOtherBack: '#e0f2fe',
    checkDone: '#0ea5e9',
    gaugeFill: '#38bdf8',
    gaugeDoneFill: '#facc15',
    gaugeBg: '#e0f2fe',
    gaugeBarBg: '#f0f9ff',
    gaugeDoneBarBg: '#f0f9ff',
    borderToday: '#7dd3fc',
    ringToday: '#bae6fd',
    borderOther: '#bae6fd',
  },
  pink: {
    // 꽃이 피어남: 핑크 진행 + 퍼플 완료
    notebookBg: '#fff5f7',
    lines: '#fbcfe8',
    todayBadgeBg: '#ec4899',
    otherBadgeBg: '#f472b6',
    ringTodayFront: '#ec4899',
    ringTodayBack: '#fbcfe8',
    ringOtherFront: '#f9a8d4',
    ringOtherBack: '#fce7f3',
    checkDone: '#ec4899',
    gaugeFill: '#f472b6',
    gaugeDoneFill: '#c026d3',
    gaugeBg: '#fce7f3',
    gaugeBarBg: '#fdf2f8',
    gaugeDoneBarBg: '#fdf4ff',
    borderToday: '#f9a8d4',
    ringToday: '#fbcfe8',
    borderOther: '#fbcfe8',
  },
  mint: {
    // 민트 + 주황: 연민트 진행 + 주황 완료
    notebookBg: '#f0fdf8',
    lines: '#86efac',
    todayBadgeBg: '#10b981',
    otherBadgeBg: '#34d399',
    ringTodayFront: '#10b981',
    ringTodayBack: '#bbf7d0',
    ringOtherFront: '#86efac',
    ringOtherBack: '#d1fae5',
    checkDone: '#10b981',
    gaugeFill: '#34d399',
    gaugeDoneFill: '#f97316',
    gaugeBg: '#d1fae5',
    gaugeBarBg: '#f0fdf4',
    gaugeDoneBarBg: '#fff7ed',
    borderToday: '#6ee7b7',
    ringToday: '#bbf7d0',
    borderOther: '#bbf7d0',
  },
  rainbow: {
    // 무지개 끝 황금: 보라 진행 + 골드 완료
    notebookBg: '#fdfcff',
    lines: '#e9d5ff',
    todayBadgeBg: '#a855f7',
    otherBadgeBg: '#a78bfa',
    ringTodayFront: '#a855f7',
    ringTodayBack: '#e9d5ff',
    ringOtherFront: '#c4b5fd',
    ringOtherBack: '#ede9fe',
    checkDone: '#a855f7',
    gaugeFill: '#a855f7',
    gaugeDoneFill: '#f59e0b',
    gaugeBg: '#ede9fe',
    gaugeBarBg: '#faf5ff',
    gaugeDoneBarBg: '#fdfcff',
    borderToday: '#c4b5fd',
    ringToday: '#e9d5ff',
    borderOther: '#e9d5ff',
    isRainbow: true,
  },
};
