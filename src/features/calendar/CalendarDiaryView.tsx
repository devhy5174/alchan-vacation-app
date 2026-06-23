import { useState, useRef } from "react";
import { FiBookOpen, FiChevronLeft, FiChevronRight, FiCalendar, FiMinus, FiPlus } from "react-icons/fi";
import AlertModal from "../../components/AlertModal";
import type { VacationPlan } from "../../types/vacation";
import { DAY_LABELS } from "../../types/vacation";
import { getDaysInRange, getDayOfWeek, toDateStr } from "../../utils/date";
import { useCompletionStore } from "../../stores/completionStore";
import { useSpecificTaskStore } from "../../stores/specificTaskStore";
import { useRewardStore } from "../../stores/rewardStore";
import { THEME_COLORS } from "../reward/diaryTheme";
import type { DiaryTheme } from "../../types/reward";
import { useStreak } from "../../hooks/useStreak";
import { loadFromStorage, saveToStorage, DIARY_FONT_STEP_KEY } from "../../utils/localStorage";

const MINI_THEMES: { id: DiaryTheme; color: string; gradient?: string; ringColor: string }[] = [
  { id: 'orange', color: '#fb923c', ringColor: '#fb923c' },
  { id: 'blue', color: '#0ea5e9', ringColor: '#0ea5e9' },
  { id: 'pink', color: '#ec4899', ringColor: '#ec4899' },
  { id: 'mint', color: '#10b981', ringColor: '#10b981' },
  { id: 'rainbow', gradient: 'linear-gradient(135deg, #f87171, #fb923c, #facc15, #4ade80, #60a5fa, #a78bfa)', color: '#a855f7', ringColor: '#a78bfa' },
];

interface Props {
  plan: VacationPlan;
}

function formatDiaryDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일 ${DAY_LABELS[getDayOfWeek(date)]}요일`;
}

function formatNavDate(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

const BASE_FONT = 14;
const BASE_LINE_H = 28;
const CONTENT_LEFT = 20;
const RING_COUNT = 13;

function SpiralRing({ front, back }: { front: string; back: string }) {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      style={{ filter: "drop-shadow(0px 1px 1.5px rgba(0,0,0,0.22))" }}
    >
      <path d="M11 1.5 A9 8 0 0 1 11 18.5" stroke={back} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M11 1.5 A9 8 0 0 0 11 18.5" stroke={front} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

function CheckMark({ done, doneColor }: { done: boolean; doneColor: string }) {
  return (
    <span
      className="shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all"
      style={{
        backgroundColor: done ? doneColor : "transparent",
        borderColor: done ? doneColor : "#d1d5db",
      }}
    >
      {done && (
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path
            d="M1 3L2.5 4.5L5 1.5"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

type AnimPhase = "idle" | "exit" | "enter";

export default function CalendarDiaryView({ plan }: Props) {
  const { completion, toggleTask } = useCompletionStore();
  const { tasks: specTasks, completion: specCompletion, toggleTask: toggleSpecTask } = useSpecificTaskStore();
  const selectedTheme = useRewardStore((s) => s.selectedTheme);
  const unlockedThemes = useRewardStore((s) => s.unlockedThemes);
  const setTheme = useRewardStore((s) => s.setTheme);
  const colors = THEME_COLORS[selectedTheme];

  // 보상 체크 (다이어리에서 할 일 체크 시 즉시 반영)
  useStreak();

  const dates = getDaysInRange(plan.startDate, plan.endDate);
  const schedule = plan.weeklySchedule;
  const todayStr = toDateStr(new Date());

  const found = dates.findIndex((d) => toDateStr(d) === todayStr);
  const todayIdx = found >= 0 ? found : 0;

  const [idx, setIdx] = useState(todayIdx);
  const [phase, setPhase] = useState<AnimPhase>("idle");
  const [pendingIdx, setPendingIdx] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [showAlert, setShowAlert] = useState(false);
  const [fontStep, setFontStepState] = useState<number>(
    () => loadFromStorage<number>(DIARY_FONT_STEP_KEY) ?? 0
  );
  const touchStartX = useRef<number | null>(null);

  const fontSize = BASE_FONT + fontStep;
  const lineH = Math.round(BASE_LINE_H * fontSize / BASE_FONT);

  function setFontStep(updater: (s: number) => number) {
    setFontStepState((s) => {
      const next = updater(s);
      saveToStorage(DIARY_FONT_STEP_KEY, next);
      return next;
    });
  }

  function navigate(newIdx: number, direction: "next" | "prev") {
    if (phase !== "idle" || newIdx < 0 || newIdx >= dates.length) return;
    setPendingIdx(newIdx);
    setDir(direction);
    setPhase("exit");
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 60) return;
    if (delta < 0) {
      navigate(idx + 1, "next");
    } else {
      navigate(idx - 1, "prev");
    }
  }

  function onAnimEnd() {
    if (phase === "exit") {
      setIdx(pendingIdx);
      setPhase("enter");
    } else {
      setPhase("idle");
    }
  }

  const pageClass =
    phase === "exit"
      ? dir === "next"
        ? "diary-exit-left"
        : "diary-exit-right"
      : phase === "enter"
        ? dir === "next"
          ? "diary-enter-right"
          : "diary-enter-left"
        : "";

  const date = dates[idx];
  const day = getDayOfWeek(date);
  const weeklyTasks = schedule?.[day] ?? [];
  const dateStr = toDateStr(date);
  const isToday = dateStr === todayStr;
  const completions = completion[dateStr] ?? [];
  const specificTasks = specTasks[dateStr] ?? [];
  const specDone = specCompletion[dateStr] ?? {};
  const weeklyDoneCount = weeklyTasks.filter((_, i) => completions[i] ?? false).length;
  const specDoneCount = specificTasks.filter((t) => specDone[t.id] ?? false).length;
  const completedCount = weeklyDoneCount + specDoneCount;
  const totalCount = weeklyTasks.length + specificTasks.length;
  const allDone = totalCount > 0 && completedCount === totalCount;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const accentColor = colors.todayBadgeBg;

  const notebookBg = {
    backgroundColor: colors.notebookBg,
    backgroundImage: `repeating-linear-gradient(transparent, transparent ${lineH - 1}px, ${colors.lines} ${lineH - 1}px, ${colors.lines} ${lineH}px)`,
    backgroundAttachment: "local" as const,
  };

  const todayBadgeStyle =
    colors.isRainbow && isToday
      ? {
          background:
            "linear-gradient(90deg, #f87171, #fb923c, #facc15, #4ade80, #60a5fa, #a78bfa)",
          boxShadow: "1px 2px 5px rgba(0,0,0,0.15)",
          transform: "rotate(-1.2deg)",
        }
      : {
          backgroundColor: isToday ? colors.todayBadgeBg : colors.otherBadgeBg,
          boxShadow: "1px 2px 5px rgba(0,0,0,0.15)",
          transform: "rotate(-1.2deg)",
        };

  const cardBoxShadow = isToday
    ? `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06), 0 0 0 2px white, 0 0 0 4px ${colors.ringToday}`
    : "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)";

  return (
    <div className="flex flex-col gap-4">
      <style>{`
        @keyframes diary-exit-left {
          from { transform: perspective(900px) translateX(0) rotateY(0deg) scale(1); opacity: 1; }
          to   { transform: perspective(900px) translateX(-40%) rotateY(-18deg) scale(0.88); opacity: 0; }
        }
        @keyframes diary-exit-right {
          from { transform: perspective(900px) translateX(0) rotateY(0deg) scale(1); opacity: 1; }
          to   { transform: perspective(900px) translateX(40%) rotateY(18deg) scale(0.88); opacity: 0; }
        }
        @keyframes diary-enter-right {
          from { transform: perspective(900px) translateX(40%) rotateY(18deg) scale(0.88); opacity: 0; }
          to   { transform: perspective(900px) translateX(0) rotateY(0deg) scale(1); opacity: 1; }
        }
        @keyframes diary-enter-left {
          from { transform: perspective(900px) translateX(-40%) rotateY(-18deg) scale(0.88); opacity: 0; }
          to   { transform: perspective(900px) translateX(0) rotateY(0deg) scale(1); opacity: 1; }
        }
        .diary-exit-left   { animation: diary-exit-left   0.2s ease-in  forwards; }
        .diary-exit-right  { animation: diary-exit-right  0.2s ease-in  forwards; }
        .diary-enter-right { animation: diary-enter-right 0.22s ease-out forwards; }
        .diary-enter-left  { animation: diary-enter-left  0.22s ease-out forwards; }

        .hand-strike {
          position: relative;
          display: inline-block;
          color: #d1d5db;
        }
        .hand-strike::after {
          content: '';
          position: absolute;
          left: -1px;
          right: -1px;
          top: 50%;
          height: 2px;
          background: #f87171;
          transform: rotate(-0.8deg) skewX(-6deg);
          border-radius: 1px;
        }
      `}</style>

      {/* 페이지 (스와이프 영역) */}
      <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div key={idx} className={pageClass} onAnimationEnd={onAnimEnd}>
          <div className="relative" style={{ paddingLeft: "14px" }}>
            {/* 스프링 링 */}
            <div
              className="absolute top-0 bottom-0 flex flex-col justify-evenly items-center py-3 z-10 pointer-events-none"
              style={{ left: "3px", width: "22px" }}
            >
              {Array.from({ length: RING_COUNT }).map((_, i) => (
                <SpiralRing
                  key={i}
                  front={isToday ? colors.ringTodayFront : colors.ringOtherFront}
                  back={isToday ? colors.ringTodayBack : colors.ringOtherBack}
                />
              ))}
            </div>

            {/* 노트 카드 */}
            <div
              className="flex flex-col rounded-2xl overflow-hidden"
              style={{
                height: "clamp(200px, calc(100svh - 330px), 480px)",
                border: `1.5px solid ${isToday ? colors.borderToday : colors.borderOther}`,
                boxShadow: cardBoxShadow,
              }}
            >
              {/* 줄노트 본문 */}
              <div className="flex-1 min-h-0 overflow-y-auto" style={notebookBg}>
                {/* 날짜 스티커 + 테마 서클 */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    height: `${lineH + 8}px`,
                    paddingLeft: `${CONTENT_LEFT}px`,
                    paddingRight: "10px",
                    paddingTop: "6px",
                  }}
                >
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold text-white"
                    style={todayBadgeStyle}
                  >
                    <FiBookOpen size={10} />
                    {formatDiaryDate(date)}
                    {isToday && (
                      <span
                        className="bg-white text-[9px] px-1 rounded font-bold leading-4"
                        style={{ color: accentColor }}
                      >
                        오늘
                      </span>
                    )}
                  </div>

                  {/* 미니 테마 서클 */}
                  <div className="flex items-center gap-1">
                    {MINI_THEMES.map(({ id, color, gradient, ringColor }) => {
                      const unlocked = unlockedThemes.includes(id);
                      const selected = selectedTheme === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => unlocked && setTheme(id)}
                          className="rounded-full transition-transform active:scale-90"
                          style={{
                            width: 12,
                            height: 12,
                            background: gradient || color,
                            filter: unlocked ? 'none' : 'grayscale(100%) opacity(0.3)',
                            boxShadow: selected ? `0 0 0 1.5px white, 0 0 0 3px ${ringColor}` : 'none',
                            cursor: unlocked ? 'pointer' : 'default',
                            border: 'none',
                            padding: 0,
                            flexShrink: 0,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 할 일 목록 */}
                {totalCount > 0 ? (
                  <ul>
                    {weeklyTasks.map((task, i) => {
                      const done = completions[i] ?? false;
                      return (
                        <li
                          key={`w-${i}`}
                          onClick={() => isToday ? toggleTask(dateStr, i, weeklyTasks.length) : setShowAlert(true)}
                          className="flex items-center cursor-pointer select-none"
                          style={{
                            height: `${lineH}px`,
                            paddingLeft: `${CONTENT_LEFT}px`,
                            paddingRight: "12px",
                          }}
                        >
                          <CheckMark done={done} doneColor={colors.checkDone} />
                          <span
                            className={`leading-none ml-2 ${done ? "hand-strike" : "text-gray-700"}`}
                            style={{ fontSize }}
                          >
                            {task.time && (
                              <span
                                className="font-medium mr-1"
                                style={{ color: done ? undefined : accentColor }}
                              >
                                [{task.time}]
                              </span>
                            )}
                            {task.text}
                          </span>
                        </li>
                      );
                    })}
                    {specificTasks.map((task) => {
                      const done = specDone[task.id] ?? false;
                      return (
                        <li
                          key={`s-${task.id}`}
                          onClick={() => isToday ? toggleSpecTask(dateStr, task.id) : setShowAlert(true)}
                          className="flex items-center cursor-pointer select-none"
                          style={{
                            height: `${lineH}px`,
                            paddingLeft: `${CONTENT_LEFT}px`,
                            paddingRight: "12px",
                          }}
                        >
                          <CheckMark done={done} doneColor={colors.checkDone} />
                          <span
                            className={`leading-none ml-2 ${done ? "hand-strike" : ""}`}
                            style={{
                              fontSize,
                              ...(!done
                                ? {
                                    color: task.important ? accentColor : "#374151",
                                    fontWeight: task.important ? 600 : undefined,
                                  }
                                : {}),
                            }}
                          >
                            {task.time && (
                              <span
                                className="font-medium mr-1"
                                style={{ color: done ? undefined : accentColor }}
                              >
                                [{task.time}]
                              </span>
                            )}
                            {task.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div
                    className="flex items-center italic"
                    style={{ height: `${lineH}px`, paddingLeft: `${CONTENT_LEFT}px` }}
                  >
                    <p className="text-gray-300" style={{ fontSize }}>할 일이 없는 날이에요</p>
                  </div>
                )}
              </div>

              {/* 진행 게이지 */}
              {totalCount > 0 && (
                <div
                  className="shrink-0 px-4 py-2 flex items-center gap-2 border-t"
                  style={{
                    borderTopColor: colors.borderOther,
                    backgroundColor: allDone ? colors.gaugeDoneBarBg : colors.gaugeBarBg,
                  }}
                >
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.gaugeBg }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        ...(allDone && colors.isRainbow
                          ? { background: 'linear-gradient(90deg, #f87171, #fb923c, #facc15, #4ade80, #60a5fa, #a78bfa)' }
                          : { backgroundColor: allDone ? colors.gaugeDoneFill : colors.gaugeFill }
                        ),
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-medium shrink-0"
                    style={{ color: allDone && colors.isRainbow ? '#a855f7' : allDone ? colors.gaugeDoneFill : colors.gaugeFill }}
                  >
                    {completedCount}/{totalCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(idx - 1, "prev")}
          disabled={idx === 0 || phase !== "idle"}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors
            ${idx === 0 || phase !== "idle"
              ? "text-gray-200 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100 cursor-pointer"}`}
        >
          <FiChevronLeft size={16} />
          {idx > 0 ? formatNavDate(dates[idx - 1]) : "이전"}
        </button>

        <div className="flex flex-col items-center gap-0.5">
          {found >= 0 && idx !== todayIdx ? (
            <button
              type="button"
              onClick={() => navigate(todayIdx, todayIdx > idx ? "next" : "prev")}
              disabled={phase !== "idle"}
              className="text-xs text-orange-400 font-medium px-3 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              오늘로
            </button>
          ) : found >= 0 ? (
            <span className="text-xs text-orange-300 font-medium">오늘</span>
          ) : null}
          <span className="text-xs text-gray-300">
            {idx + 1} / {dates.length}
          </span>
          <div
            className="flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full border"
            style={{ borderColor: `${accentColor}50`, backgroundColor: `${accentColor}12` }}
          >
            <button
              type="button"
              onClick={() => setFontStep((s) => Math.max(0, s - 1))}
              disabled={fontStep <= 0}
              className="w-4 h-4 flex items-center justify-center transition-opacity cursor-pointer disabled:cursor-default"
              style={{ color: fontStep <= 0 ? '#d1d5db' : accentColor }}
            >
              <FiMinus size={10} />
            </button>
            <span
              className="text-[10px] font-bold w-8 text-center tabular-nums"
              style={{ color: accentColor }}
            >
              {Math.round((fontSize / BASE_FONT) * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setFontStep((s) => Math.min(8, s + 1))}
              disabled={fontStep >= 8}
              className="w-4 h-4 flex items-center justify-center transition-opacity cursor-pointer disabled:cursor-default"
              style={{ color: fontStep >= 8 ? '#d1d5db' : accentColor }}
            >
              <FiPlus size={10} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(idx + 1, "next")}
          disabled={idx === dates.length - 1 || phase !== "idle"}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors
            ${idx === dates.length - 1 || phase !== "idle"
              ? "text-gray-200 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100 cursor-pointer"}`}
        >
          {idx < dates.length - 1 ? formatNavDate(dates[idx + 1]) : "다음"}
          <FiChevronRight size={16} />
        </button>
      </div>

      {showAlert && (
        <AlertModal
          message="오늘 할 일이 아니에요"
          subMessage="할 일 체크는 해당 날짜에만 할 수 있어요"
          icon={<FiCalendar size={40} />}
          buttonLabel="확인"
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
