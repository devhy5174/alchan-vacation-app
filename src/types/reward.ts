export type DiaryTheme = 'orange' | 'blue' | 'pink' | 'mint' | 'rainbow';

export interface RewardData {
  unlockedThemes: DiaryTheme[];
  selectedTheme: DiaryTheme;
  maxStreak: number;
}

export const REWARD_MILESTONES: {
  streak: number;
  type: 'theme';
  id: string;
  label: string;
}[] = [
  { streak: 7,  type: 'theme', id: 'blue',    label: '스카이블루 테마' },
  { streak: 14, type: 'theme', id: 'pink',    label: '핑크 테마' },
  { streak: 21, type: 'theme', id: 'mint',    label: '민트 테마' },
  { streak: 5,  type: 'theme', id: 'rainbow', label: '무지개 테마' },
];
