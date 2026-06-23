import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiTrash2,
  FiFileText,
  FiShield,
  FiInfo,
  FiChevronRight,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import PinLockScreen from "../components/PinLockScreen";

const PIN_KEY = 'alchan_pin';

const TERMS_CONTENT = `제1조 (목적)
이 약관은 알찬방학(이하 "앱")의 이용 조건을 정함을 목적으로 합니다.

제2조 (서비스 내용)
앱은 아이의 방학 계획 작성 및 관리 기능을 제공합니다. 모든 데이터는 기기 내 로컬 저장소에만 저장되며, 별도 서버로 전송되지 않습니다.

제3조 (이용자의 의무)
이용자는 앱을 통해 타인의 권리를 침해하거나 법령에 위반되는 행위를 해서는 안 됩니다.

제4조 (서비스 변경 및 중단)
개발자는 서비스 내용을 변경하거나 중단할 수 있으며, 이에 대해 이용자에게 별도의 보상을 하지 않습니다.

제5조 (책임 제한)
앱은 기기 내 저장 데이터의 유실에 대해 책임을 지지 않습니다. 중요한 데이터는 별도로 백업하시기 바랍니다.

제6조 (문의)
서비스 관련 문의는 devhy5174@naver.com 으로 연락주세요.`;

const PRIVACY_CONTENT = `알찬방학 개인정보처리방침

최종 업데이트: 2026년 6월 23일

1. 수집하는 개인정보
알찬방학은 어떠한 개인정보도 수집하지 않습니다.

2. 데이터 저장 방식
앱에 입력된 모든 정보(아이 이름, 방학 계획, 할 일 등)는 오직 사용자의 기기 내 로컬 저장소(LocalStorage)에만 저장됩니다. 서버 전송, 외부 공유, 광고 활용이 일체 없습니다.

3. 제3자 제공
수집하는 데이터가 없으므로 제3자에게 제공되는 정보가 없습니다.

4. 데이터 삭제
앱 내 설정 > 데이터 초기화 또는 기기의 앱 데이터 삭제를 통해 모든 데이터를 삭제할 수 있습니다.

5. 문의
개인정보 관련 문의: devhy5174@naver.com`;

type ModalType = "terms" | "privacy" | "reset" | null;

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

      {/* 모달 */}
      {modal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-orange-50">
          <div className="sticky top-0 bg-orange-50 px-4 pt-8 pb-3 border-b border-orange-100 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <FiX size={20} />
            </button>
            <h2 className="text-base font-bold text-gray-800">
              {modal === "terms" ? "이용약관" : "개인정보처리방침"}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {modal === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT}
            </p>
          </div>
        </div>
      )}

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
            onClick={() => setModal("terms")}
          />
          <Item
            icon={<FiShield size={16} className="text-orange-400" />}
            label="개인정보처리방침"
            onClick={() => setModal("privacy")}
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
