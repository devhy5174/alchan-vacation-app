import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

export default function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
          <FiChevronLeft size={22} />
        </button>
        <h1 className="text-base font-bold text-gray-800">개인정보처리방침</h1>
      </div>
      <div className="px-5 py-6">
      <p className="text-xs text-gray-400 mb-6">최종 업데이트: 2026년 6월 23일</p>

      <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-800 mb-2">1. 수집하는 개인정보</h2>
          <p>알찬방학은 어떠한 개인정보도 수집하지 않습니다.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-2">2. 데이터 저장 방식</h2>
          <p>
            앱에 입력된 모든 정보(아이 이름, 방학 계획, 할 일 등)는 오직 사용자의
            기기 내 로컬 저장소(LocalStorage)에만 저장됩니다. 서버 전송, 외부 공유,
            광고 활용이 일체 없습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-2">3. 제3자 제공</h2>
          <p>수집하는 데이터가 없으므로 제3자에게 제공되는 정보가 없습니다.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-2">4. 데이터 삭제</h2>
          <p>
            앱 내 설정 &gt; 데이터 초기화 또는 기기의 앱 데이터 삭제를 통해
            모든 데이터를 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-2">5. 문의</h2>
          <p>
            개인정보 관련 문의:{' '}
            <a href="mailto:devhy5174@naver.com" className="text-orange-400 underline">
              devhy5174@naver.com
            </a>
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
