export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-5 py-10 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-6">이용약관</h1>

      <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-800 mb-2">제1조 (목적)</h2>
          <p>
            이 약관은 알찬방학(이하 "앱")의 이용 조건을 정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-2">제2조 (서비스 내용)</h2>
          <p>
            앱은 아이의 방학 계획 작성 및 관리 기능을 제공합니다. 모든 데이터는
            기기 내 로컬 저장소에만 저장되며, 별도 서버로 전송되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-2">제3조 (이용자의 의무)</h2>
          <p>
            이용자는 앱을 통해 타인의 권리를 침해하거나 법령에 위반되는 행위를
            해서는 안 됩니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-2">제4조 (서비스 변경 및 중단)</h2>
          <p>
            개발자는 서비스 내용을 변경하거나 중단할 수 있으며, 이에 대해
            이용자에게 별도의 보상을 하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-2">제5조 (책임 제한)</h2>
          <p>
            앱은 기기 내 저장 데이터의 유실에 대해 책임을 지지 않습니다.
            중요한 데이터는 별도로 백업하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-2">제6조 (문의)</h2>
          <p>
            서비스 관련 문의:{' '}
            <a href="mailto:devhy5174@naver.com" className="text-orange-400 underline">
              devhy5174@naver.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
