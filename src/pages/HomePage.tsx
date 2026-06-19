import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiRepeat, FiStar } from "react-icons/fi";
import VacationForm from "../features/vacation/VacationForm";
import VacationPreviewCard from "../features/vacation/VacationPreviewCard";
import WeeklyScheduleForm from "../features/vacation/WeeklyScheduleForm";
import SpecificDateTaskForm from "../features/vacation/SpecificDateTaskForm";
import MemoSection from "../features/memo/MemoSection";
import { useVacationStore } from "../stores/vacationStore";

type TaskTab = "repeat" | "specific";

export default function HomePage() {
  const plan = useVacationStore((s) => s.plan);
  const [formOpen, setFormOpen] = useState(!plan);
  const [taskTab, setTaskTab] = useState<TaskTab>("repeat");

  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto flex flex-col gap-5">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">알찬방학</h1>
          <p className="text-sm text-gray-400">아이의 방학 계획을 함께 만들어요</p>
        </div>

        {plan && <VacationPreviewCard />}

        {/* 방학 정보 입력 */}
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

            {/* 할 일 관리 카드 (탭) */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
              {/* 탭 헤더 */}
              <div className="flex border-b border-orange-100">
                <button
                  type="button"
                  onClick={() => setTaskTab("repeat")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold transition-colors cursor-pointer
                    ${taskTab === "repeat"
                      ? "text-orange-400 border-b-2 border-orange-400"
                      : "text-gray-400 hover:text-gray-600"}`}
                >
                  <FiRepeat size={13} />
                  반복 할 일
                </button>
                <button
                  type="button"
                  onClick={() => setTaskTab("specific")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold transition-colors cursor-pointer
                    ${taskTab === "specific"
                      ? "text-orange-400 border-b-2 border-orange-400"
                      : "text-gray-400 hover:text-gray-600"}`}
                >
                  <FiStar size={13} />
                  특별 할 일
                </button>
              </div>

              {/* 탭 콘텐츠 */}
              <div className="p-5">
                {taskTab === "repeat" ? (
                  <WeeklyScheduleForm />
                ) : (
                  <SpecificDateTaskForm />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
