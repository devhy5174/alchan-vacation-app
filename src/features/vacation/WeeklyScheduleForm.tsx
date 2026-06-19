import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import { DAYS_OF_WEEK } from '../../types/vacation';
import type { WeeklySchedule, DayOfWeek, Task } from '../../types/vacation';
import { useVacationStore } from '../../stores/vacationStore';
import Button from '../../components/Button';
import AlertModal from '../../components/AlertModal';
import DayScheduleEditor from './DayScheduleEditor';
import RepeatTaskAdder from './RepeatTaskAdder';

const EMPTY_SCHEDULE: WeeklySchedule = {
  mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
};

export default function WeeklyScheduleForm() {
  const { plan, setPlan } = useVacationStore();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

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
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate('/calendar');
  };

  return (
    <>
      {showAlert && (
        <AlertModal
          icon={<FiCalendar size={48} />}
          message="캘린더가 만들어졌어요!"
          subMessage="캘린더 페이지로 이동할게요"
          buttonLabel="캘린더 보러가기"
          onClose={handleAlertClose}
        />
      )}

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
    </>
  );
}
