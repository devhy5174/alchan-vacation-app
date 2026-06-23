import { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiClock,
} from "react-icons/fi";
import { DAY_LABELS } from "../../types/vacation";
import { filterBadWords } from "../../utils/filter";
import type { DayOfWeek, Task } from "../../types/vacation";
import TimePickerModal from "../../components/TimePickerModal";

interface Props {
  day: DayOfWeek;
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  onDeleteAll?: (task: Task) => void;
}

type PickerTarget = "add" | "edit";

function TimeButton({ time, onClick }: { time: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 shrink-0 px-2 py-1.5 rounded-lg border border-orange-200 bg-white text-xs font-medium transition-colors hover:border-orange-300 cursor-pointer"
    >
      <FiClock size={12} className="text-orange-400" />
      <span className={time ? "text-orange-400" : "text-gray-400"}>
        {time || "시간"}
      </span>
    </button>
  );
}

export default function DayScheduleEditor({
  day,
  tasks,
  onChange,
  onDeleteAll,
}: Props) {
  const isWeekend = day === "sat" || day === "sun";
  const [inputText, setInputText] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editTime, setEditTime] = useState("");
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onChange([
      ...tasks,
      { text: trimmed, ...(inputTime ? { time: inputTime } : {}) },
    ]);
    setInputText("");
    setInputTime("");
  };

  const handleDeleteConfirm = () => {
    if (pendingDelete === null) return;
    const target = tasks[pendingDelete];
    if (onDeleteAll) {
      onDeleteAll(target);
    } else {
      onChange(tasks.filter((_, i) => i !== pendingDelete));
    }
    if (editingIndex === pendingDelete) setEditingIndex(null);
    setPendingDelete(null);
  };

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditText(tasks[index].text);
    setEditTime(tasks[index].time ?? "");
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    const trimmed = editText.trim();
    if (!trimmed) return;
    onChange(
      tasks.map((t, i) =>
        i === editingIndex
          ? { text: trimmed, ...(editTime ? { time: editTime } : {}) }
          : t,
      ),
    );
    setEditingIndex(null);
  };

  const handleEditCancel = () => setEditingIndex(null);

  const handlePickerConfirm = (time: string) => {
    if (pickerTarget === "add") setInputTime(time);
    if (pickerTarget === "edit") setEditTime(time);
    setPickerTarget(null);
  };

  const handlePickerClear = () => {
    if (pickerTarget === "add") setInputTime("");
    if (pickerTarget === "edit") setEditTime("");
    setPickerTarget(null);
  };

  const currentPickerValue = pickerTarget === "add" ? inputTime : editTime;

  return (
    <>
      {pendingDelete !== null && (
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
                  할 일을 삭제할까요?
                </p>
                <p className="text-sm text-gray-400 text-center">
                  <span className="font-medium text-gray-600">
                    "{tasks[pendingDelete]?.text}"
                  </span>
                  이(가)
                  <br />
                  모든 요일에서 삭제돼요
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
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 bg-red-400 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {pickerTarget && (
        <TimePickerModal
          value={currentPickerValue || undefined}
          onConfirm={handlePickerConfirm}
          onClear={handlePickerClear}
          onClose={() => setPickerTarget(null)}
        />
      )}

      <div className="border border-orange-100 rounded-xl p-3 flex flex-col gap-2">
        <span
          className={`text-sm font-bold ${isWeekend ? "text-orange-400" : "text-gray-600"}`}
        >
          {DAY_LABELS[day]}요일
        </span>

        {tasks.map((task, index) =>
          editingIndex === index ? (
            <div key={index} className="flex items-center gap-1.5">
              <TimeButton
                time={editTime}
                onClick={() => setPickerTarget("edit")}
              />
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(filterBadWords(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Escape") handleEditCancel();
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") handleEditSave();
                }}
                autoFocus
                className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-lg border border-orange-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="button"
                onClick={handleEditSave}
                className="text-orange-400 hover:text-orange-500 cursor-pointer shrink-0"
              >
                <FiCheck size={15} />
              </button>
              <button
                type="button"
                onClick={handleEditCancel}
                className="text-gray-400 hover:text-gray-500 cursor-pointer shrink-0"
              >
                <FiX size={15} />
              </button>
            </div>
          ) : (
            <div key={index} className="flex items-center gap-2">
              <span className="flex-1 text-sm text-gray-700 leading-snug">
                {task.time && (
                  <span className="text-orange-400 font-medium mr-1">
                    [{task.time}]
                  </span>
                )}
                {task.text}
              </span>
              <button
                type="button"
                onClick={() => handleEditStart(index)}
                className="text-gray-300 hover:text-orange-400 cursor-pointer transition-colors shrink-0"
              >
                <FiEdit2 size={13} />
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(index)}
                className="text-gray-300 hover:text-red-400 cursor-pointer transition-colors shrink-0"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          ),
        )}

        <div className="flex items-center gap-1.5 mt-0.5">
          <TimeButton time={inputTime} onClick={() => setPickerTarget("add")} />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(filterBadWords(e.target.value))}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder={`${DAY_LABELS[day]}요일 할 일 추가`}
            className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-lg border border-orange-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-300"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="text-orange-400 hover:text-orange-500 cursor-pointer transition-colors shrink-0"
          >
            <FiPlus size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
