import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import VacationForm from "../features/vacation/VacationForm";
import VacationPreviewCard from "../features/vacation/VacationPreviewCard";
import WeeklyScheduleForm from "../features/vacation/WeeklyScheduleForm";
import MemoSection from "../features/memo/MemoSection";
import { useVacationStore } from "../stores/vacationStore";

export default function HomePage() {
  const plan = useVacationStore((s) => s.plan);
  const [formOpen, setFormOpen] = useState(!plan);

  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto flex flex-col gap-5">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">알찬방학</h1>
          <p className="text-sm text-gray-400">아이의 방학 계획을 함께 만들어요</p>
        </div>

        {plan && <VacationPreviewCard />}

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
          >
            <span className="text-base font-bold text-gray-800">
              {plan ? "정보 수정" : "방학 정보 입력"}
            </span>
            {formOpen
              ? <FiChevronUp size={18} className="text-gray-400" />
              : <FiChevronDown size={18} className="text-gray-400" />
            }
          </button>
          {formOpen && (
            <div className="px-5 pb-5">
              <VacationForm />
            </div>
          )}
        </div>

        {plan && (
          <>
            <MemoSection />
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
              <h2 className="text-base font-bold text-gray-800 mb-4">요일별 할 일</h2>
              <WeeklyScheduleForm />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
