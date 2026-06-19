// Supabase 이전 시 vacation_results 테이블에 그대로 매핑 가능한 구조
// camelCase → snake_case 변환만 하면 됨 (childName → child_name 등)
export interface VacationResult {
  id: string;            // `${startDate}_${endDate}` (Supabase: UUID)
  childName: string;
  startDate: string;     // YYYY-MM-DD
  endDate: string;       // YYYY-MM-DD
  goal: string;
  achievementRate: number;
  totalTasks: number;
  completedTasks: number;
  longestStreak: number;
  bestDayOfWeek: string;
  stickerCount: number;
  savedAt: string;       // ISO 8601 (Supabase: TIMESTAMPTZ)
}
