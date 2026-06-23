import { FiCheckCircle, FiZap, FiStar } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import type { VacationPlan } from "../types/vacation";

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
  return dateStr.replace(/-/g, ".");
}

const GOLD = "#c9a227";
const CREAM = "linear-gradient(160deg, #fdf8ee 0%, #fef3d4 100%)";
const CA = {
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
} as React.CSSProperties;

export default function CertificatePrint({ plan, stats, seasonLabel }: Props) {
  return (
    <div
      style={{
        width: "210mm",
        height: "297mm",
        overflow: "hidden",
        background: CREAM,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "13mm 13mm",
        boxSizing: "border-box",
        position: "relative",
        pageBreakInside: "avoid",
        breakInside: "avoid",
        ...CA,
      }}
    >
      {/* 외곽 이중 테두리 */}
      <div
        style={{
          position: "absolute",
          inset: "5.5mm",
          border: `3mm solid ${GOLD}`,
          borderRadius: "2mm",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "9mm",
          border: `0.7mm solid ${GOLD}`,
          borderRadius: "1mm",
          pointerEvents: "none",
        }}
      />

      {/* 모서리 장식 */}
      {(
        [
          { top: "6mm", left: "6mm" },
          { top: "6mm", right: "6mm", transform: "scaleX(-1)" },
          { bottom: "6mm", left: "6mm", transform: "scaleY(-1)" },
          { bottom: "6mm", right: "6mm", transform: "scale(-1,-1)" },
        ] as React.CSSProperties[]
      ).map((style, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            color: GOLD,
            fontSize: "10mm",
            lineHeight: 1,
            ...style,
          }}
        >
          ❧
        </span>
      ))}

      {/* 본문 */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "7mm",
        }}
      >
        {/* 트로피 */}
        <div
          style={{
            width: "24mm",
            height: "24mm",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f9d423 0%, #e6ac00 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 3mm 8mm rgba(201,162,39,0.4)",
            ...CA,
          }}
        >
          <FaTrophy size={50} color="#fff" />
        </div>

        {/* 제목 */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "14mm",
              fontWeight: 900,
              color: "#2d1a00",
              letterSpacing: "2mm",
              lineHeight: 1,
            }}
          >
            알찬방학 수료증
          </h1>
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: "85%",
            height: "0.4mm",
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
          }}
        />

        {/* 이름 */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 2mm",
              fontSize: "2mm",
              color: "#999",
              letterSpacing: "1.5mm",
              lineHeight: 1,
            }}
          >
            이 름
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "26mm",
              fontWeight: 900,
              color: "#e07a00",
              lineHeight: 1,
            }}
          >
            {plan.childName}
          </p>
        </div>

        {/* 점선 */}
        <div style={{ width: "85%", borderBottom: "0.5mm dashed #d4b96a" }} />

        {/* 방학 기간 */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 2mm",
              fontSize: "4mm",
              color: "#999",
              letterSpacing: "1mm",
              lineHeight: 1,
            }}
          >
            방학 기간
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "8mm",
              fontWeight: 700,
              color: "#444",
              lineHeight: 1,
            }}
          >
            {fmt(plan.startDate)} ~ {fmt(plan.endDate)}
          </p>
        </div>

        {/* 통계 3칸 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            width: "100%",
            background: "rgba(255,255,255,0.7)",
            border: `0.4mm solid rgba(201,162,39,0.25)`,
            borderRadius: "3mm",
            padding: "4mm 3mm",
            ...CA,
          }}
        >
          {[
            {
              icon: <FiCheckCircle size={22} color="#22c55e" />,
              label: "달성률",
              value: `${stats.achievementRate}%`,
            },
            {
              icon: <FiZap size={22} color="#f97316" />,
              label: "최장 연속",
              value: `${stats.longestStreak}일`,
              border: true,
            },
            {
              icon: (
                <FiStar size={22} color="#eab308" style={{ fill: "#eab308" }} />
              ),
              label: "획득 스티커",
              value: `${stats.stickerCount}개`,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderLeft: item.border ? `0.3mm solid #e5d9c0` : undefined,
                borderRight: item.border ? `0.3mm solid #e5d9c0` : undefined,
                padding: "0 2mm",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1.5mm",
                }}
              >
                {item.icon}
              </div>
              <p
                style={{
                  margin: "0 0 1.5mm",
                  fontSize: "3mm",
                  color: "#888",
                  lineHeight: 1,
                  textAlign: "center",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "9mm",
                  fontWeight: 900,
                  color: "#f97316",
                  lineHeight: 1,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* 리본 메시지 */}
        <div style={{ width: "100%", filter: "drop-shadow(0 2mm 4mm rgba(0,0,0,0.3))" }}>
          <div
            style={{
              background: "linear-gradient(to bottom, #e84545 0%, #c0392b 45%, #8b1a1a 100%)",
              color: "#fff",
              textAlign: "center",
              padding: "6mm 14mm",
              clipPath: "polygon(5mm 0%, calc(100% - 5mm) 0%, 100% 50%, calc(100% - 5mm) 100%, 5mm 100%, 0% 50%)",
              position: "relative",
              ...CA,
            }}
          >
            {/* 상단 하이라이트 */}
            <div style={{
              position: "absolute",
              top: "2mm", left: "10mm", right: "10mm",
              height: "0.5mm",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "1mm",
            }} />
            <p style={{
              margin: 0,
              fontSize: "5.5mm",
              fontWeight: 800,
              lineHeight: 1.5,
              letterSpacing: "0.3mm",
              textShadow: "0 0.5mm 2mm rgba(0,0,0,0.4)",
            }}>
              "{seasonLabel} 동안 정말 수고했어요! 🎉"
            </p>
          </div>
        </div>

        {/* 서명란 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "3mm",
            width: "100%",
            marginTop: "2mm",
          }}
        >
          <span style={{ fontSize: "5.5mm", color: "#666", lineHeight: 1 }}>
            보호자 서명
          </span>
          <div style={{ width: "50mm", borderBottom: "0.5mm solid #aaa" }} />
        </div>

        {/* 날짜 */}
        <p style={{ margin: 0, fontSize: "4mm", color: "#bbb", lineHeight: 1 }}>
          {fmt(plan.endDate)} 기준
        </p>

        {/* 하단 장식 */}
        <div
          style={{
            color: GOLD,
            fontSize: "6mm",
            letterSpacing: "4mm",
            lineHeight: 1,
          }}
        >
          ❧ ✦ ❧
        </div>
      </div>
    </div>
  );
}
