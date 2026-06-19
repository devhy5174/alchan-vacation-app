import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useVacationStore } from '../../stores/vacationStore';
import type { VacationPlan } from '../../types/vacation';

export default function VacationForm() {
  const { plan, setPlan } = useVacationStore();

  const [form, setForm] = useState<VacationPlan>({
    childName: plan?.childName ?? '',
    startDate: plan?.startDate ?? '',
    endDate: plan?.endDate ?? '',
    goal: plan?.goal ?? '',
  });

  useEffect(() => {
    setForm({
      childName: plan?.childName ?? '',
      startDate: plan?.startDate ?? '',
      endDate: plan?.endDate ?? '',
      goal: plan?.goal ?? '',
    });
  }, [plan]);

  const handleChange = (field: keyof VacationPlan) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.childName || !form.startDate || !form.endDate || !form.goal) return;
    if (form.endDate < form.startDate) return;
    setPlan(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="아이 이름"
        value={form.childName}
        onChange={handleChange('childName')}
        placeholder="이름을 입력하세요"
        required
      />
      <Input
        label="방학 시작일"
        type="date"
        value={form.startDate}
        onChange={handleChange('startDate')}
        required
      />
      <Input
        label="방학 종료일"
        type="date"
        value={form.endDate}
        onChange={handleChange('endDate')}
        required
      />
      <Input
        label="방학 목표"
        value={form.goal}
        onChange={handleChange('goal')}
        placeholder="이번 방학의 목표를 입력하세요"
        required
      />
      <Button type="submit" fullWidth>
        저장하기
      </Button>
    </form>
  );
}
