import { FiAlertCircle } from 'react-icons/fi';
import { formatDate } from '../utils/date';

interface PlanSummary {
  childName: string;
  startDate: string;
  endDate: string;
  goal: string;
}

interface Props {
  plan: PlanSummary;
  onConfirm: () => void;
  onCancel: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-400 shrink-0 w-10">{label}</span>
      <span className="text-gray-700 font-medium break-all">{value}</span>
    </div>
  );
}

export default function ConfirmModal({ plan, onConfirm, onCancel }: Props) {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-8 pointer-events-none">
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl pointer-events-auto w-full max-w-xs">
          <div className="flex flex-col items-center gap-2">
            <FiAlertCircle size={36} className="text-orange-400" />
            <p className="text-base font-bold text-gray-800 text-center">
              이 내용으로 저장할까요?
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 flex flex-col gap-2.5">
            <Row label="이름" value={plan.childName} />
            <Row label="시작일" value={formatDate(plan.startDate)} />
            <Row label="종료일" value={formatDate(plan.endDate)} />
            <Row label="목표" value={plan.goal} />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
