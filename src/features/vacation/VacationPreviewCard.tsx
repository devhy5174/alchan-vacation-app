import { FiCalendar, FiUser, FiTarget, FiTrash2 } from 'react-icons/fi';
import { useVacationStore } from '../../stores/vacationStore';
import { formatDate, calcTotalDays } from '../../utils/date';

export default function VacationPreviewCard() {
  const { plan, clearPlan } = useVacationStore();

  if (!plan) return null;

  const totalDays = calcTotalDays(plan.startDate, plan.endDate);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">저장된 방학 정보</h2>
        <span className="text-sm font-semibold text-orange-400 bg-orange-50 px-3 py-1 rounded-full">
          총 {totalDays}일
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm">
          <FiUser size={14} className="text-orange-400 shrink-0" />
          <span className="text-gray-500 w-10 shrink-0">이름</span>
          <span className="text-gray-800 font-medium">{plan.childName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FiCalendar size={14} className="text-orange-400 shrink-0" />
          <span className="text-gray-500 w-10 shrink-0">기간</span>
          <span className="text-gray-800">
            {formatDate(plan.startDate)} ~ {formatDate(plan.endDate)}
          </span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <FiTarget size={14} className="text-orange-400 shrink-0 mt-0.5" />
          <span className="text-gray-500 w-10 shrink-0">목표</span>
          <span className="text-gray-800">{plan.goal}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={clearPlan}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors self-end cursor-pointer"
      >
        <FiTrash2 size={12} />
        초기화
      </button>
    </div>
  );
}
