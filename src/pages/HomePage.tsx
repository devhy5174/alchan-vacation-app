import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiRepeat, FiStar, FiMapPin, FiLock, FiUnlock, FiGift } from "react-icons/fi";
import VacationForm from "../features/vacation/VacationForm";
import VacationPreviewCard from "../features/vacation/VacationPreviewCard";
import WeeklyScheduleForm from "../features/vacation/WeeklyScheduleForm";
import SpecificDateTaskForm from "../features/vacation/SpecificDateTaskForm";
import MemoSection from "../features/memo/MemoSection";
import PinLockScreen from "../components/PinLockScreen";
import PinSetupModal from "../components/PinSetupModal";
import ParentRewardSection from "../features/reward/ParentRewardSection";
import { useVacationStore } from "../stores/vacationStore";

type TaskTab = "repeat" | "specific" | "reward";

const INTRO_KEY = 'alchan_intro_shown';
const PIN_KEY = 'alchan_pin';

export default function HomePage() {
  const navigate = useNavigate();
  const plan = useVacationStore((s) => s.plan);
  const [formOpen, setFormOpen] = useState(!plan);
  const [taskTab, setTaskTab] = useState<TaskTab>("repeat");
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem(INTRO_KEY));

  const storedPin = localStorage.getItem(PIN_KEY);
  // 홈에 올 때마다 잠금 — 캘린더로 이동 시 컴포넌트 언마운트되어 자동 초기화
  const [unlocked, setUnlocked] = useState(false);
  const isLocked = !!storedPin && !unlocked;

  const [showPinSetup, setShowPinSetup] = useState(false);

  function closeIntro() {
    localStorage.setItem(INTRO_KEY, '1');
    setShowIntro(false);
  }

  function handleUnlock() {
    setUnlocked(true);
  }

  function handlePinSave(pin: string) {
    localStorage.setItem(PIN_KEY, pin);
    setUnlocked(false); // 저장 즉시 잠금
    setShowPinSetup(false);
  }

  function handlePinRemove() {
    localStorage.removeItem(PIN_KEY);
    setShowPinSetup(false);
  }

  if (isLocked) {
    return (
      <PinLockScreen
        storedPin={storedPin!}
        onUnlock={handleUnlock}
        onGoToCalendar={() => navigate('/calendar')}
      />
    );
  }

  return (
    <div className="px-4 py-8">
      {showPinSetup && (
        <PinSetupModal
          hasPin={!!localStorage.getItem(PIN_KEY)}
          onSave={handlePinSave}
          onRemove={handlePinRemove}
          onClose={() => setShowPinSetup(false)}
        />
      )}

      {showIntro && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={closeIntro} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl pointer-events-auto overflow-hidden">
              <div className="px-6 pt-6 pb-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <FiMapPin size={18} className="text-orange-400 shrink-0" />
                  <p className="text-base font-bold text-gray-800">알찬방학 안내</p>
                </div>
                <div className="flex flex-col gap-3 text-sm text-gray-600 leading-relaxed">
                  <p>알찬방학은 회원가입 없이 바로 사용할 수 있습니다.</p>
                  <p>작성한 계획과 기록은 <span className="font-medium text-gray-800">현재 기기에만 저장</span>됩니다.</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    앱 삭제, 브라우저 데이터 삭제, 기기 변경 시<br />
                    데이터가 사라질 수 있습니다.
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    중요한 계획은 주기적으로 캡처 또는 PDF로 보관해 주세요.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={closeIntro}
                  className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="max-w-md mx-auto flex flex-col gap-5">
        <div className="relative text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">알찬방학</h1>
          <p className="text-sm text-gray-400">
            아이의 방학 계획을 함께 만들어요
          </p>
          <button
            type="button"
            onClick={() => setShowPinSetup(true)}
            title={storedPin ? '잠금 설정 변경' : '잠금 설정'}
            className={`absolute right-0 top-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer
              ${storedPin
                ? 'bg-orange-100 text-orange-400 hover:bg-orange-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
          >
            {storedPin ? <FiLock size={15} /> : <FiUnlock size={15} />}
          </button>
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
            {formOpen ? (
              <FiChevronUp size={18} className="text-gray-400" />
            ) : (
              <FiChevronDown size={18} className="text-gray-400" />
            )}
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
                    ${taskTab === "repeat" ? "text-orange-400 border-b-2 border-orange-400" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <FiRepeat size={13} />
                  반복 할 일
                </button>
                <button
                  type="button"
                  onClick={() => setTaskTab("specific")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold transition-colors cursor-pointer
                    ${taskTab === "specific" ? "text-orange-400 border-b-2 border-orange-400" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <FiStar size={13} />
                  특별 할 일
                </button>
                <button
                  type="button"
                  onClick={() => setTaskTab("reward")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold transition-colors cursor-pointer
                    ${taskTab === "reward" ? "text-orange-400 border-b-2 border-orange-400" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <FiGift size={13} />
                  응원
                </button>
              </div>

              {/* 탭 콘텐츠 */}
              <div className="p-5">
                {taskTab === "repeat" ? (
                  <WeeklyScheduleForm />
                ) : taskTab === "specific" ? (
                  <SpecificDateTaskForm />
                ) : (
                  <ParentRewardSection plan={plan} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
