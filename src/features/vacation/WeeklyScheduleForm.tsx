import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DAYS_OF_WEEK } from '../../types/vacation';
import type { WeeklySchedule, DayOfWeek, Task } from '../../types/vacation';
import { useVacationStore } from '../../stores/vacationStore';
import Button from '../../components/Button';
import DayScheduleEditor from './DayScheduleEditor';
import RepeatTaskAdder from './RepeatTaskAdder';

const EMPTY_SCHEDULE: WeeklySchedule = {
  mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
};

export default function WeeklyScheduleForm() {
  const { plan, setPlan } = useVacationStore();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState<WeeklySchedule>(
    plan?.weeklySchedule ?? EMPTY_SCHEDULE
  );

  useEffect(() => {
    setSchedule(plan?.weeklySchedule ?? EMPTY_SCHEDULE);
  }, [plan?.weeklySchedule]);

  const handleChange = (day: DayOfWeek) => (tasks: Task[]) => {
    setSchedule((prev) => ({ ...prev, [day]: tasks }));
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

  const handleCreate = () => {
    if (!plan) return;
    setPlan({ ...plan, weeklySchedule: schedule });
    navigate('/calendar');
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
        />
      ))}

      <div className="pt-1">
        <Button type="button" onClick={handleCreate} fullWidth>
          캘린더 만들기
        </Button>
      </div>
    </div>
  );
}
