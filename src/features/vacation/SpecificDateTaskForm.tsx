import { useState } from 'react';
import { FiCalendar, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiClock, FiStar } from 'react-icons/fi';
import TimePickerModal from '../../components/TimePickerModal';
import { useSpecificTaskStore } from '../../stores/specificTaskStore';
import { useVacationStore } from '../../stores/vacationStore';
import type { SpecificTask } from '../../types/specificTask';

function TimeButton({ time, onClick }: { time: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 shrink-0 px-2 py-1.5 rounded-lg border border-orange-200 bg-white text-xs font-medium transition-colors hover:border-orange-300 cursor-pointer"
    >
      <FiClock size={12} className="text-orange-400" />
      <span className={time ? 'text-orange-400' : 'text-gray-400'}>{time || '시간'}</span>
    </button>
  );
}

function ImportantToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 shrink-0 px-2 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer
        ${active
          ? 'border-orange-300 bg-orange-50 text-orange-500'
          : 'border-gray-200 bg-white text-gray-400 hover:border-orange-200 hover:text-orange-400'}`}
    >
      <FiStar size={11} className={active ? 'text-orange-400' : ''} style={{ fill: active ? 'currentColor' : 'none' }} />
      중요
    </button>
  );
}

function formatDateLabel(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${parseInt(month)}월 ${parseInt(day)}일`;
}

type PickerTarget = 'add' | 'edit';

export default function SpecificDateTaskForm() {
  const plan = useVacationStore((s) => s.plan);
  const { tasks, addTask, updateTask, removeTask } = useSpecificTaskStore();

  const [inputDate, setInputDate] = useState(plan?.startDate ?? '');
  const [inputText, setInputText] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [inputImportant, setInputImportant] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [editing, setEditing] = useState<{ date: string; id: string } | null>(null);
  const [editText, setEditText] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editImportant, setEditImportant] = useState(false);

  if (!plan) return null;

  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (!trimmed || !inputDate) return;
    addTask(inputDate, trimmed, inputTime || undefined, inputImportant || undefined);
    setInputText('');
    setInputTime('');
    setInputImportant(false);
  };

  const handleEditStart = (date: string, task: SpecificTask) => {
    setEditing({ date, id: task.id });
    setEditText(task.text);
    setEditTime(task.time ?? '');
    setEditImportant(task.important ?? false);
  };

  const handleEditSave = () => {
    if (!editing) return;
    const trimmed = editText.trim();
    if (!trimmed) return;
    updateTask(editing.date, editing.id, trimmed, editTime || undefined, editImportant || undefined);
    setEditing(null);
  };

  const handleEditCancel = () => setEditing(null);

  const handlePickerConfirm = (time: string) => {
    if (pickerTarget === 'add') setInputTime(time);
    else setEditTime(time);
    setPickerTarget(null);
  };

  const handlePickerClear = () => {
    if (pickerTarget === 'add') setInputTime('');
    else setEditTime('');
    setPickerTarget(null);
  };

  const sortedDates = Object.keys(tasks)
    .filter((d) => d >= plan.startDate && d <= plan.endDate)
    .sort();

  const totalCount = sortedDates.reduce((sum, d) => sum + (tasks[d]?.length ?? 0), 0);

  return (
    <>
      {pickerTarget && (
        <TimePickerModal
          value={pickerTarget === 'add' ? inputTime || undefined : editTime || undefined}
          onConfirm={handlePickerConfirm}
          onClear={handlePickerClear}
          onClose={() => setPickerTarget(null)}
        />
      )}

      <div className="flex flex-col gap-3">
        {/* 추가 폼 */}
        <div className="border border-orange-100 rounded-xl p-3 flex flex-col gap-2">
          {/* 날짜 선택 */}
          <div className="flex items-center gap-2 pb-2 border-b border-orange-50">
            <FiCalendar size={13} className="text-orange-400 shrink-0" />
            <input
              type="date"
              value={inputDate}
              min={plan.startDate}
              max={plan.endDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
          {/* 시간 + 중요 + 할 일 + 추가 버튼 */}
          <div className="flex items-center gap-1.5">
            <TimeButton time={inputTime} onClick={() => setPickerTarget('add')} />
            <ImportantToggle active={inputImportant} onClick={() => setInputImportant((v) => !v)} />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyUp={(e) => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="할 일을 입력하세요"
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

        {/* 날짜별 할 일 목록 */}
        {sortedDates.map((dateStr) => (
          <div key={dateStr} className="flex flex-col gap-1.5">
            <p className="text-xs font-bold text-orange-400 px-1">{formatDateLabel(dateStr)}</p>
            {(tasks[dateStr] ?? []).map((task) =>
              editing?.date === dateStr && editing?.id === task.id ? (
                <div key={task.id} className="flex items-center gap-1.5">
                  <TimeButton time={editTime} onClick={() => setPickerTarget('edit')} />
                  <ImportantToggle active={editImportant} onClick={() => setEditImportant((v) => !v)} />
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Escape') handleEditCancel(); }}
                    onKeyUp={(e) => { if (e.key === 'Enter') handleEditSave(); }}
                    autoFocus
                    className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-lg border border-orange-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  <button type="button" onClick={handleEditSave} className="text-orange-400 hover:text-orange-500 cursor-pointer shrink-0">
                    <FiCheck size={15} />
                  </button>
                  <button type="button" onClick={handleEditCancel} className="text-gray-400 hover:text-gray-500 cursor-pointer shrink-0">
                    <FiX size={15} />
                  </button>
                </div>
              ) : (
                <div key={task.id} className="flex items-center gap-2">
                  {task.important && (
                    <FiStar size={11} className="shrink-0 text-orange-400" style={{ fill: 'currentColor' }} />
                  )}
                  <span className={`flex-1 text-sm leading-snug ${task.important ? 'font-medium text-orange-500' : 'text-gray-700'}`}>
                    {task.time && (
                      <span className={`font-medium mr-1 ${task.important ? 'text-orange-500' : 'text-orange-400'}`}>
                        [{task.time}]
                      </span>
                    )}
                    {task.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEditStart(dateStr, task)}
                    className="text-gray-300 hover:text-orange-400 cursor-pointer transition-colors shrink-0"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTask(dateStr, task.id)}
                    className="text-gray-300 hover:text-red-400 cursor-pointer transition-colors shrink-0"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              )
            )}
          </div>
        ))}

        {totalCount === 0 && (
          <p className="text-xs text-gray-300 text-center py-1">아직 특별 할 일이 없어요</p>
        )}
      </div>
    </>
  );
}
