import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiClock } from 'react-icons/fi';
import { DAY_LABELS } from '../../types/vacation';
import type { DayOfWeek, Task } from '../../types/vacation';
import TimePickerModal from '../../components/TimePickerModal';

interface Props {
  day: DayOfWeek;
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
}

type PickerTarget = 'add' | 'edit';

function TimeButton({ time, onClick }: { time: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 shrink-0 px-2 py-1.5 rounded-lg border border-orange-200 bg-white text-xs font-medium transition-colors hover:border-orange-300 cursor-pointer"
    >
      <FiClock size={12} className="text-orange-400" />
      <span className={time ? 'text-orange-400' : 'text-gray-400'}>
        {time || '시간'}
      </span>
    </button>
  );
}

export default function DayScheduleEditor({ day, tasks, onChange }: Props) {
  const isWeekend = day === 'sat' || day === 'sun';
  const [inputText, setInputText] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editTime, setEditTime] = useState('');
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);

  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onChange([...tasks, { text: trimmed, ...(inputTime ? { time: inputTime } : {}) }]);
    setInputText('');
    setInputTime('');
  };

  const handleDelete = (index: number) => {
    onChange(tasks.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditText(tasks[index].text);
    setEditTime(tasks[index].time ?? '');
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    const trimmed = editText.trim();
    if (!trimmed) return;
    onChange(tasks.map((t, i) =>
      i === editingIndex ? { text: trimmed, ...(editTime ? { time: editTime } : {}) } : t
    ));
    setEditingIndex(null);
  };

  const handleEditCancel = () => setEditingIndex(null);

  const handlePickerConfirm = (time: string) => {
    if (pickerTarget === 'add') setInputTime(time);
    if (pickerTarget === 'edit') setEditTime(time);
    setPickerTarget(null);
  };

  const handlePickerClear = () => {
    if (pickerTarget === 'add') setInputTime('');
    if (pickerTarget === 'edit') setEditTime('');
    setPickerTarget(null);
  };

  const currentPickerValue = pickerTarget === 'add' ? inputTime : editTime;

  return (
    <>
      {pickerTarget && (
        <TimePickerModal
          value={currentPickerValue || undefined}
          onConfirm={handlePickerConfirm}
          onClear={handlePickerClear}
          onClose={() => setPickerTarget(null)}
        />
      )}

      <div className="border border-orange-100 rounded-xl p-3 flex flex-col gap-2">
        <span className={`text-sm font-bold ${isWeekend ? 'text-orange-400' : 'text-gray-600'}`}>
          {DAY_LABELS[day]}요일
        </span>

        {tasks.map((task, index) =>
          editingIndex === index ? (
            <div key={index} className="flex items-center gap-1.5">
              <TimeButton time={editTime} onClick={() => setPickerTarget('edit')} />
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
            <div key={index} className="flex items-center gap-2">
              <span className="flex-1 text-sm text-gray-700 leading-snug">
                {task.time && (
                  <span className="text-orange-400 font-medium mr-1">[{task.time}]</span>
                )}
                {task.text}
              </span>
              <button type="button" onClick={() => handleEditStart(index)}
                className="text-gray-300 hover:text-orange-400 cursor-pointer transition-colors shrink-0">
                <FiEdit2 size={13} />
              </button>
              <button type="button" onClick={() => handleDelete(index)}
                className="text-gray-300 hover:text-red-400 cursor-pointer transition-colors shrink-0">
                <FiTrash2 size={13} />
              </button>
            </div>
          )
        )}

        <div className="flex items-center gap-1.5 mt-0.5">
          <TimeButton time={inputTime} onClick={() => setPickerTarget('add')} />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyUp={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder={`${DAY_LABELS[day]}요일 할 일 추가`}
            className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-lg border border-orange-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-300"
          />
          <button type="button" onClick={handleAdd}
            className="text-orange-400 hover:text-orange-500 cursor-pointer transition-colors shrink-0">
            <FiPlus size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
