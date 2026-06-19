import { useState, useRef } from "react";
import { FiBookOpen, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { VacationPlan } from "../../types/vacation";
import { DAY_LABELS } from "../../types/vacation";
import { getDaysInRange, getDayOfWeek, toDateStr } from "../../utils/date";
import { useCompletionStore } from "../../stores/completionStore";

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

const LINE_H = 28;

type AnimPhase = "idle" | "exit" | "enter";

export default function CalendarDiaryView({ plan }: Props) {
  const { completion, toggleTask } = useCompletionStore();
  const dates = getDaysInRange(plan.startDate, plan.endDate);
  const schedule = plan.weeklySchedule;
  const todayStr = toDateStr(new Date());

  const found = dates.findIndex((d) => toDateStr(d) === todayStr);
  const todayIdx = found >= 0 ? found : 0;

  const [idx, setIdx] = useState(todayIdx);
  const [phase, setPhase] = useState<AnimPhase>("idle");
  const [pendingIdx, setPendingIdx] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const touchStartX = useRef<number | null>(null);

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
  const tasks = schedule?.[day] ?? [];
  const dateStr = toDateStr(date);
  const isToday = dateStr === todayStr;
  const completions = completion[dateStr] ?? [];
  const completedCount = tasks.filter((_, i) => completions[i] ?? false).length;
  const allDone = tasks.length > 0 && completedCount === tasks.length;
  const pct =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

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
      `}</style>

      {/* 페이지 (스와이프 영역 포함) */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div key={idx} className={pageClass} onAnimationEnd={onAnimEnd}>
          {/* 카드: flex col + 기기 높이에 맞춘 고정 높이 */}
          <div
            className={`flex flex-col rounded-2xl overflow-hidden shadow-sm border
              ${
                isToday
                  ? "border-orange-300 ring-2 ring-orange-200 ring-offset-1"
                  : allDone
                    ? "border-orange-200"
                    : "border-amber-100"
              }`}
            style={{ height: "clamp(200px, calc(100svh - 330px), 480px)" }}
          >
            {/* 헤더 */}
            <div
              className={`shrink-0 px-4 py-3 flex items-center justify-between
                ${isToday ? "bg-orange-400" : allDone ? "bg-orange-50" : "bg-amber-50"}`}
            >
              <div className="flex items-center gap-1.5">
                {isToday && (
                  <FiBookOpen size={13} className="text-white shrink-0" />
                )}
                <span
                  className={`text-sm font-semibold ${isToday ? "text-white" : "text-orange-400"}`}
                >
                  {isToday ? "오늘의 할일" : formatDiaryDate(date)}
                </span>
              </div>
              {isToday && (
                <span className="text-xs text-orange-100">
                  {formatDiaryDate(date)}
                </span>
              )}
              {allDone && !isToday && (
                <span className="text-xs text-orange-400 font-medium">
                  모두 완료
                </span>
              )}
            </div>

            {/* 줄노트 본문: 남은 공간을 모두 채우고 내용 많으면 스크롤 */}
            <div
              className="flex-1 min-h-0 overflow-y-auto px-4 py-2"
              style={{
                backgroundColor: "#fffdf7",
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 27px, #e8dcc5 27px, #e8dcc5 28px)",
                backgroundPosition: "0 8px",
                backgroundAttachment: "local",
              }}
            >
              {tasks.length > 0 ? (
                <ul>
                  {tasks.map((task, i) => {
                    const done = completions[i] ?? false;
                    return (
                      <li
                        key={i}
                        onClick={() => toggleTask(dateStr, i, tasks.length)}
                        className="flex items-center gap-2.5 cursor-pointer select-none"
                        style={{ height: `${LINE_H}px` }}
                      >
                        <span
                          className={`shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all
                            ${
                              done
                                ? "bg-orange-400 border-orange-400"
                                : "bg-transparent border-gray-300"
                            }`}
                        >
                          {done && (
                            <svg
                              width="6"
                              height="6"
                              viewBox="0 0 6 6"
                              fill="none"
                            >
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
                        <span
                          className={`text-sm leading-none transition-colors
                            ${done ? "line-through text-gray-300" : "text-gray-700"}`}
                        >
                          {task.time && (
                            <span
                              className={`font-medium mr-1 ${done ? "text-gray-300" : "text-orange-400"}`}
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
                  style={{ height: `${LINE_H}px` }}
                >
                  <p className="text-sm text-gray-300">할 일이 없는 날이에요</p>
                </div>
              )}
            </div>

            {/* 진행 게이지 */}
            {tasks.length > 0 && (
              <div
                className={`shrink-0 px-4 py-2 flex items-center gap-2 border-t
                  ${allDone ? "border-orange-100 bg-orange-50" : "border-amber-100 bg-amber-50"}`}
              >
                <div className="flex-1 h-1 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium shrink-0 ${allDone ? "text-orange-400" : "text-gray-400"}`}
                >
                  {completedCount}/{tasks.length}
                </span>
              </div>
            )}
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
            ${
              idx === 0 || phase !== "idle"
                ? "text-gray-200 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-100 cursor-pointer"
            }`}
        >
          <FiChevronLeft size={16} />
          {idx > 0 ? formatNavDate(dates[idx - 1]) : "이전"}
        </button>

        {/* 가운데: 오늘로 버튼 or 오늘 표시 */}
        <div className="flex flex-col items-center gap-0.5">
          {found >= 0 && idx !== todayIdx ? (
            <button
              type="button"
              onClick={() =>
                navigate(todayIdx, todayIdx > idx ? "next" : "prev")
              }
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
        </div>

        <button
          type="button"
          onClick={() => navigate(idx + 1, "next")}
          disabled={idx === dates.length - 1 || phase !== "idle"}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors
            ${
              idx === dates.length - 1 || phase !== "idle"
                ? "text-gray-200 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-100 cursor-pointer"
            }`}
        >
          {idx < dates.length - 1 ? formatNavDate(dates[idx + 1]) : "다음"}
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
