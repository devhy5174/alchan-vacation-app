import { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiGift,
  FiMessageCircle,
  FiEdit2,
  FiCalendar,
} from "react-icons/fi";
import { filterBadWords } from "../../utils/filter";
import type { VacationPlan } from "../../types/vacation";
import type { RewardIcon, ParentReward } from "../../types/parentReward";
import { useParentRewardStore } from "../../stores/parentRewardStore";
import { toDateStr } from "../../utils/date";

interface Props {
  plan: VacationPlan;
}

const ICON_OPTIONS: {
  value: RewardIcon;
  icon: typeof FiGift;
  label: string;
}[] = [
  { value: "gift", icon: FiGift, label: "선물" },
  { value: "message", icon: FiMessageCircle, label: "메시지" },
];

export default function ParentRewardSection({ plan }: Props) {
  const { rewards, addReward, updateReward, removeReward } =
    useParentRewardStore();
  const todayStr = toDateStr(new Date());

  // 추가 폼
  const [date, setDate] = useState("");
  const [text, setText] = useState("");
  const [icon, setIcon] = useState<RewardIcon>("gift");

  // 삭제 확인
  const [pendingDelete, setPendingDelete] = useState<ParentReward | null>(null);

  // 수정 모달
  const [editTarget, setEditTarget] = useState<ParentReward | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editText, setEditText] = useState("");
  const [editIcon, setEditIcon] = useState<RewardIcon>("gift");

  function handleAdd() {
    if (!date || !text.trim()) return;
    addReward(date, text.trim(), icon);
    setDate("");
    setText("");
    setIcon("gift");
  }

  function openEdit(r: ParentReward) {
    setEditTarget(r);
    setEditDate(r.date);
    setEditText(r.text);
    setEditIcon(r.icon);
  }

  function handleEditSave() {
    if (!editTarget || !editDate || !editText.trim()) return;
    updateReward(editTarget.id, editDate, editText.trim(), editIcon);
    setEditTarget(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-400 leading-relaxed">
        날짜와 응원 메시지를 입력하면 달성판에서 해당 날짜에 표시돼요.
      </p>

      {/* 삭제 확인 모달 */}
      {pendingDelete && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setPendingDelete(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-8 pointer-events-none">
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl pointer-events-auto w-full max-w-xs">
              <div className="flex flex-col items-center gap-2">
                <FiTrash2 size={32} className="text-red-400" />
                <p className="text-base font-bold text-gray-800 text-center">
                  응원을 삭제할까요?
                </p>
                <p className="text-sm text-gray-400 text-center">
                  <span className="font-medium text-gray-600">
                    "{pendingDelete.text}"
                  </span>
                  을<br />
                  삭제해요
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeReward(pendingDelete.id);
                    setPendingDelete(null);
                  }}
                  className="flex-1 py-2.5 bg-red-400 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 수정 모달 */}
      {editTarget && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setEditTarget(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-8 pointer-events-none">
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl pointer-events-auto w-full max-w-xs">
              <p className="text-base font-bold text-gray-800 text-center">
                응원 수정
              </p>
              <div className="flex gap-2">
                {ICON_OPTIONS.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEditIcon(value)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer
                      ${editIcon === value ? "border-orange-400 bg-orange-50 text-orange-500" : "border-gray-200 text-gray-400"}`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-orange-300">
                <FiCalendar size={13} className="text-orange-400 shrink-0" />
                <input
                  type="date"
                  value={editDate}
                  min={plan.startDate}
                  max={plan.endDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(filterBadWords(e.target.value))}
                maxLength={30}
                placeholder="응원 메시지"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-orange-300"
                onKeyUp={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing)
                    handleEditSave();
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={!editDate || !editText.trim()}
                  className="flex-1 py-2.5 bg-orange-400 disabled:bg-gray-100 text-white disabled:text-gray-300 text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-default"
                >
                  수정
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 추가 폼 */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {ICON_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setIcon(value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer
                ${icon === value ? "border-orange-400 bg-orange-50 text-orange-500" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-orange-300">
          <FiCalendar size={13} className="text-orange-400 shrink-0" />
          <input
            type="date"
            value={date}
            min={plan.startDate}
            max={plan.endDate}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(filterBadWords(e.target.value))}
            placeholder={
              icon === "message"
                ? "ex) 여기까지 대단한데? 화이팅!"
                : "ex) 치킨먹는날"
            }
            maxLength={30}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-orange-300"
            onKeyUp={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) handleAdd();
            }}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!date || !text.trim()}
            className="shrink-0 w-11 h-11 rounded-xl bg-orange-400 disabled:bg-gray-100 text-white disabled:text-gray-300 flex items-center justify-center cursor-pointer disabled:cursor-default transition-colors"
          >
            <FiPlus size={18} />
          </button>
        </div>
      </div>

      {/* 응원 목록 */}
      {rewards.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {rewards.map((r) => {
            const IconComp = r.icon === "message" ? FiMessageCircle : FiGift;
            return (
              <li
                key={r.id}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100"
              >
                <IconComp size={13} className="shrink-0 text-orange-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">{r.date}</span>
                    {r.icon === "message" && r.date > todayStr && (
                      <span className="text-xs text-orange-400 font-medium">
                        오픈 예정
                      </span>
                    )}
                  </div>
                  <span className="text-sm truncate block text-gray-700">
                    {r.text}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(r)}
                  className="shrink-0 p-1 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(r)}
                  className="shrink-0 p-1 text-gray-300 hover:text-red-400 cursor-pointer transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-300 text-center py-2">
          아직 작성한 응원이 없어요
        </p>
      )}
    </div>
  );
}
