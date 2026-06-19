import VacationForm from "../features/vacation/VacationForm";
import VacationPreviewCard from "../features/vacation/VacationPreviewCard";
import WeeklyScheduleForm from "../features/vacation/WeeklyScheduleForm";
import { useVacationStore } from "../stores/vacationStore";

export default function HomePage() {
  const plan = useVacationStore((s) => s.plan);

  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto flex flex-col gap-5">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">알찬방학</h1>
          <p className="text-sm text-gray-400">아이의 방학 계획을 함께 만들어요</p>
        </div>

        {plan && <VacationPreviewCard />}

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            {plan ? "정보 수정" : "방학 정보 입력"}
          </h2>
          <VacationForm />
        </div>

        {plan && (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">요일별 할 일</h2>
            <WeeklyScheduleForm />
          </div>
        )}
      </div>
    </div>
  );
}
