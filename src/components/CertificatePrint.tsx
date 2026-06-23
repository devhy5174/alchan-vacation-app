import { FiAward, FiCheckCircle, FiZap, FiStar } from 'react-icons/fi';
import type { VacationPlan } from '../types/vacation';

interface Stats {
  achievementRate: number;
  longestStreak: number;
  stickerCount: number;
}

interface Props {
  plan: VacationPlan;
  stats: Stats;
  seasonLabel: string;
}

function fmt(dateStr: string) {
  return dateStr.replace(/-/g, '.');
}

const GOLD = '#c9a227';
const CREAM = 'linear-gradient(160deg, #fdf8ee 0%, #fef3d4 100%)';
const RED_RIBBON = 'linear-gradient(to bottom, #c0392b 0%, #8b1a1a 100%)';

export default function CertificatePrint({ plan, stats, seasonLabel }: Props) {
  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      background: CREAM,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '14mm 14mm',
      boxSizing: 'border-box',
      position: 'relative',
      printColorAdjust: 'exact',
      WebkitPrintColorAdjust: 'exact',
    } as React.CSSProperties}>

      {/* 외곽 이중 테두리 */}
      <div style={{ position: 'absolute', inset: '6mm', border: `3.5mm solid ${GOLD}`, borderRadius: '2mm', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: '10mm', border: `0.8mm solid ${GOLD}`, borderRadius: '1mm', pointerEvents: 'none' }} />

      {/* 모서리 장식 */}
      {[
        { top: '7mm', left: '7mm' },
        { top: '7mm', right: '7mm', transform: 'scaleX(-1)' },
        { bottom: '7mm', left: '7mm', transform: 'scaleY(-1)' },
        { bottom: '7mm', right: '7mm', transform: 'scale(-1,-1)' },
      ].map((style, i) => (
        <span key={i} style={{ position: 'absolute', color: GOLD, fontSize: '12mm', lineHeight: 1, ...style }}>❧</span>
      ))}

      {/* 본문 */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '7mm',
      }}>

        {/* 트로피 */}
        <div style={{
          width: '22mm', height: '22mm', borderRadius: '50%',
          background: 'linear-gradient(135deg, #f9d423 0%, #e6ac00 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3mm 8mm rgba(201,162,39,0.35)',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        } as React.CSSProperties}>
          <FiAward size={40} color="#fff" />
        </div>

        {/* 장식 점 + 제목 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: GOLD, fontSize: '5mm', letterSpacing: '3mm', marginBottom: '3mm' }}>✦ ✦ ✦</div>
          <h1 style={{ margin: 0, fontSize: '13mm', fontWeight: 900, color: '#2d1a00', letterSpacing: '2mm' }}>
            알찬방학 수료증
          </h1>
          <div style={{ color: GOLD, fontSize: '5mm', letterSpacing: '3mm', marginTop: '3mm' }}>✦ ✦ ✦</div>
        </div>

        {/* 구분선 */}
        <div style={{ width: '85%', height: '0.4mm', background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />

        {/* 이름 */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 2mm', fontSize: '4mm', color: '#999', letterSpacing: '1.5mm' }}>이 름</p>
          <p style={{ margin: 0, fontSize: '24mm', fontWeight: 900, color: '#e07a00', lineHeight: 1.1 }}>
            {plan.childName}
          </p>
        </div>

        {/* 점선 */}
        <div style={{ width: '85%', borderBottom: '0.5mm dashed #d4b96a' }} />

        {/* 방학 기간 */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 2mm', fontSize: '4mm', color: '#999', letterSpacing: '1mm' }}>방학 기간</p>
          <p style={{ margin: 0, fontSize: '8mm', fontWeight: 700, color: '#444' }}>
            {fmt(plan.startDate)} ~ {fmt(plan.endDate)}
          </p>
        </div>

        {/* 통계 3칸 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          width: '100%',
          background: 'rgba(255,255,255,0.7)',
          border: `0.4mm solid rgba(201,162,39,0.25)`,
          borderRadius: '4mm',
          padding: '7mm 4mm',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        } as React.CSSProperties}>
          {[
            { icon: <FiCheckCircle size={30} color="#22c55e" />, label: '달성률', value: `${stats.achievementRate}%` },
            { icon: <FiZap size={30} color="#f97316" />, label: '최장 연속', value: `${stats.longestStreak}일`, border: true },
            { icon: <FiStar size={30} color="#eab308" style={{ fill: '#eab308' }} />, label: '획득 스티커', value: `${stats.stickerCount}개` },
          ].map((item, i) => (
            <div key={i} style={{
              textAlign: 'center',
              borderLeft: item.border ? `0.3mm solid #e5d9c0` : undefined,
              borderRight: item.border ? `0.3mm solid #e5d9c0` : undefined,
              padding: '0 3mm',
            }}>
              <div style={{ marginBottom: '2mm' }}>{item.icon}</div>
              <p style={{ margin: '0 0 2mm', fontSize: '3.5mm', color: '#888' }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: '13mm', fontWeight: 900, color: '#f97316' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* 리본 메시지 */}
        <div style={{ width: '100%', position: 'relative' }}>
          <div style={{
            background: RED_RIBBON,
            color: '#fff',
            textAlign: 'center',
            padding: '5.5mm 18mm',
            position: 'relative',
            boxShadow: '0 2mm 6mm rgba(0,0,0,0.2)',
            printColorAdjust: 'exact',
            WebkitPrintColorAdjust: 'exact',
          } as React.CSSProperties}>
            <div style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8mm solid transparent', borderBottom: '8mm solid transparent', borderRight: '7mm solid #8b1a1a' }} />
            <div style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8mm solid transparent', borderBottom: '8mm solid transparent', borderLeft: '7mm solid #8b1a1a' }} />
            <p style={{ margin: 0, fontSize: '5.5mm', fontWeight: 700, letterSpacing: '0.3mm' }}>
              "{seasonLabel} 동안 정말 수고했어요! 🎉"
            </p>
          </div>
        </div>

        {/* 서명란 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '4mm', width: '100%', marginTop: '4mm' }}>
          <span style={{ fontSize: '4.5mm', color: '#777' }}>보호자 서명</span>
          <div style={{ width: '45mm', borderBottom: '0.4mm solid #bbb' }} />
        </div>

        {/* 날짜 */}
        <p style={{ margin: 0, fontSize: '3mm', color: '#bbb' }}>{fmt(plan.endDate)} 기준</p>

        {/* 하단 장식 */}
        <div style={{ color: GOLD, fontSize: '7mm', letterSpacing: '5mm' }}>❧ ✦ ❧</div>
      </div>
    </div>
  );
}
