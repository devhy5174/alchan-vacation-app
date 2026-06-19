import { useState, useEffect } from 'react';
import { FiAward, FiCheckCircle, FiZap, FiSun, FiStar, FiCalendar } from 'react-icons/fi';
import { useVacationStore } from '../stores/vacationStore';
import { useCompletionStore } from '../stores/completionStore';
import { useHistoryStore } from '../stores/historyStore';
import { calcResultStats } from '../utils/resultStats';
import { toDateStr } from '../utils/date';
import type { VacationResult } from '../types/history';

// 방학 시작월 기준 시즌 레이블
function getSeasonLabel(startDate: string): string {
  const [year, month] = startDate.split('-').map(Number);
  if (month >= 6 && month <= 8) return `${year} 여름방학`;
  if (month === 12 || month <= 2) return `${year} 겨울방학`;
  if (month >= 3 && month <= 5) return `${year} 봄방학`;
  return `${year} 방학`;
}

function CircularProgress({ rate }: { rate: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setProgress(rate), 120);
    return () => clearTimeout(id);
  }, [rate]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
      <svg width="144" height="144" className="-rotate-90" aria-hidden="true">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="72" cy="72" r={radius}
          fill="none"
          stroke="#fb923c"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-800 leading-none">{rate}%</span>
        <span className="text-xs text-gray-400 mt-0.5">달성률</span>
      </div>
    </div>
  );
}

function HistoryItem({ result }: { result: VacationResult }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm text-gray-700 font-medium">{getSeasonLabel(result.startDate)}</p>
        <p className="text-xs text-gray-400">{result.startDate} ~ {result.endDate}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-orange-300 h-1.5 rounded-full"
            style={{ width: `${result.achievementRate}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-orange-400 w-9 text-right">
          {result.achievementRate}%
        </span>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const plan = useVacationStore((s) => s.plan);
  const completion = useCompletionStore((s) => s.completion);
  const results = useHistoryStore((s) => s.results);

  if (!plan) {
    return (
      <div className="px-4 py-8 max-w-md mx-auto">
        <p className="text-center text-gray-400 mt-20 text-sm">방학 정보가 없습니다.</p>
      </div>
    );
  }

  const today = toDateStr(new Date());
  const isVacationOver = today > plan.endDate;
  const stats = calcResultStats(plan, completion);

  // 현재 방학 제외한 이전 기록 (최신순)
  const previousResults = results.filter(
    (r) => !(r.startDate === plan.startDate && r.endDate === plan.endDate)
  );

  return (
    <div className="px-4 py-8 max-w-md mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FiAward size={20} className="text-orange-400" />
          <h1 className="text-xl font-bold text-gray-800">{plan.childName}의 알찬방학 결과</h1>
        </div>
        <p className="text-sm text-gray-400">{plan.startDate} ~ {plan.endDate}</p>
        {!isVacationOver && (
          <span className="inline-block mt-2 px-3 py-0.5 text-xs font-medium bg-orange-100 text-orange-500 rounded-full">
            진행 중
          </span>
        )}
      </div>

      {/* 원형 달성률 카드 */}
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm text-center">
        <CircularProgress rate={stats.achievementRate} />
        <p className="text-xs text-gray-400 mt-3">
          총 {stats.totalTasks}개 중 {stats.completedTasks}개 완료
        </p>
        {!isVacationOver && (
          <p className="text-xs text-orange-400 mt-1.5">
            방학이 끝나면 결과가 자동 저장돼요
          </p>
        )}
      </div>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <FiZap size={13} className="text-yellow-400" />
            <p className="text-xs text-gray-400">최장 연속 달성</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.longestStreak}
            <span className="text-sm font-normal text-gray-400 ml-1">일</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <FiSun size={13} className="text-orange-300" />
            <p className="text-xs text-gray-400">가장 성실한 요일</p>
          </div>
          <p className="text-xl font-bold text-gray-800 truncate">{stats.bestDayOfWeek}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <FiCheckCircle size={13} className="text-green-400" />
            <p className="text-xs text-gray-400">완료한 할 일</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.completedTasks}
            <span className="text-sm font-normal text-gray-400 ml-1">개</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <FiStar size={13} className="text-pink-400" />
            <p className="text-xs text-gray-400">획득 스티커</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.stickerCount}
            <span className="text-sm font-normal text-gray-400 ml-1">개</span>
          </p>
        </div>
      </div>

      {/* 이전 방학 기록 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-3">
          <FiCalendar size={13} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-600">이전 방학 기록</h2>
        </div>

        {previousResults.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-4">
            아직 이전 방학 기록이 없어요
          </p>
        ) : (
          <div>
            {previousResults.map((result) => (
              <HistoryItem key={result.id} result={result} />
            ))}
          </div>
        )}

        <p className="text-xs text-gray-300 mt-3 text-center">
          방학 종료 후 자동으로 기록에 추가돼요
        </p>
      </div>
    </div>
  );
}
