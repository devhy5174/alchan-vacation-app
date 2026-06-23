import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiTrash2,
  FiFileText,
  FiShield,
  FiInfo,
  FiChevronRight,
  FiAlertTriangle,
} from "react-icons/fi";
import PinLockScreen from "../components/PinLockScreen";

const PIN_KEY = 'alchan_pin';

type ModalType = "reset" | null;

export default function SettingsPage() {
  const navigate = useNavigate();
  const storedPin = localStorage.getItem(PIN_KEY);
  const [unlocked, setUnlocked] = useState(!storedPin);
  const [modal, setModal] = useState<ModalType>(null);
  const [resetDone, setResetDone] = useState(false);

  if (!unlocked) {
    return (
      <PinLockScreen
        storedPin={storedPin!}
        onUnlock={() => setUnlocked(true)}
        onGoToCalendar={() => navigate(-1)}
        onResetPin={() => { localStorage.removeItem(PIN_KEY); setUnlocked(true); }}
      />
    );
  }

  function handleReset() {
    localStorage.clear();
    setResetDone(true);
  }

  return (
    <div className="px-4 py-8">
      <h1 className="text-xl font-bold text-gray-800 mb-6">설정</h1>

      {/* 데이터 초기화 확인 모달 */}
      {modal === "reset" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs flex flex-col items-center gap-4 shadow-xl">
            {resetDone ? (
              <>
                <FiInfo size={36} className="text-orange-400" />
                <div className="text-center">
                  <p className="font-bold text-gray-800">초기화 완료</p>
                  <p className="text-sm text-gray-400 mt-1">앱을 다시 시작해주세요</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setModal(null); setResetDone(false); window.location.href = '/'; }}
                  className="w-full py-2.5 bg-orange-400 text-white text-sm font-semibold rounded-xl cursor-pointer"
                >
                  확인
                </button>
              </>
            ) : (
              <>
                <FiAlertTriangle size={36} className="text-red-400" />
                <div className="text-center">
                  <p className="font-bold text-gray-800">데이터를 초기화할까요?</p>
                  <p className="text-sm text-gray-400 mt-1">방학 계획, 달성 기록, 응원 메시지 등<br />모든 데이터가 삭제되며 되돌릴 수 없어요</p>
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-semibold rounded-xl cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-2.5 bg-red-400 text-white text-sm font-semibold rounded-xl cursor-pointer"
                  >
                    초기화
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* 고객지원 */}
        <Section label="고객지원">
          <Item
            icon={<FiMail size={16} className="text-orange-400" />}
            label="문의하기"
            sub="devhy5174@naver.com"
            onClick={() => window.open("mailto:devhy5174@naver.com")}
          />
        </Section>

        {/* 법적 고지 */}
        <Section label="법적 고지">
          <Item
            icon={<FiFileText size={16} className="text-orange-400" />}
            label="이용약관"
            onClick={() => navigate("/terms")}
          />
          <Item
            icon={<FiShield size={16} className="text-orange-400" />}
            label="개인정보처리방침"
            onClick={() => navigate("/privacy")}
            last
          />
        </Section>

        {/* 데이터 */}
        <Section label="데이터">
          <Item
            icon={<FiTrash2 size={16} className="text-red-400" />}
            label="데이터 초기화"
            labelColor="text-red-400"
            onClick={() => setModal("reset")}
            last
          />
        </Section>

        {/* 앱 정보 */}
        <Section label="앱 정보">
          <Item
            icon={<FiInfo size={16} className="text-orange-400" />}
            label="버전"
            sub="1.0.0"
            last
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 px-1">{label}</p>
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Item({
  icon, label, sub, onClick, last, labelColor,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick?: () => void;
  last?: boolean;
  labelColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors
        ${onClick ? "hover:bg-orange-50 cursor-pointer active:bg-orange-100" : "cursor-default"}
        ${!last ? "border-b border-gray-50" : ""}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className={`flex-1 text-sm font-medium ${labelColor ?? "text-gray-700"}`}>{label}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
      {onClick && !sub && <FiChevronRight size={14} className="text-gray-300 shrink-0" />}
    </button>
  );
}
