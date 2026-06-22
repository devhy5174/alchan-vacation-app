import { useState, useEffect, useRef } from 'react';
import { DAYS_OF_WEEK } from '../../types/vacation';
import type { WeeklySchedule, DayOfWeek, Task } from '../../types/vacation';
import { useVacationStore } from '../../stores/vacationStore';
import DayScheduleEditor from './DayScheduleEditor';
import RepeatTaskAdder from './RepeatTaskAdder';

const EMPTY_SCHEDULE: WeeklySchedule = {
  mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
};

export default function WeeklyScheduleForm() {
  const { plan, setPlan } = useVacationStore();
  const isFirstRender = useRef(true);

  const [schedule, setSchedule] = useState<WeeklySchedule>(
    plan?.weeklySchedule ?? EMPTY_SCHEDULE
  );

  // plan이 외부에서 바뀌면 동기화
  useEffect(() => {
    setSchedule(plan?.weeklySchedule ?? EMPTY_SCHEDULE);
  }, [plan?.weeklySchedule]);

  // schedule 변경 시 자동 저장 (초기 렌더 제외)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!plan) return;
    setPlan({ ...plan, weeklySchedule: schedule });
  }, [schedule]);

  const handleChange = (day: DayOfWeek) => (tasks: Task[]) => {
    setSchedule((prev) => ({ ...prev, [day]: tasks }));
  };

  const handleDeleteAll = (task: Task) => {
    setSchedule((prev) => {
      const next = { ...prev };
      for (const day of DAYS_OF_WEEK) {
        next[day] = next[day].filter((t) => t.text !== task.text);
      }
      return next;
    });
  };

  const handleRepeatAdd = (task: Task, days: DayOfWeek[]) => {
    setSchedule((prev) => {
      const next = { ...prev };
      for (const day of days) {
        if (!next[day].some((t) => t.text === task.text)) {
          next[day] = [...next[day], task];
        }
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <RepeatTaskAdder onAdd={handleRepeatAdd} />

      {DAYS_OF_WEEK.map((day) => (
        <DayScheduleEditor
          key={day}
          day={day}
          tasks={schedule[day]}
          onChange={handleChange(day)}
          onDeleteAll={handleDeleteAll}
        />
      ))}
    </div>
  );
}
