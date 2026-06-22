export type RewardIcon = 'gift' | 'message';

export interface ParentReward {
  id: string;
  date: string;
  text: string;
  icon: RewardIcon;
}
