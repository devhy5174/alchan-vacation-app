import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { FiSave, FiInfo } from 'react-icons/fi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AlertModal from '../../components/AlertModal';
import ConfirmModal from '../../components/ConfirmModal';
import { useVacationStore } from '../../stores/vacationStore';
import type { VacationPlan } from '../../types/vacation';

export default function VacationForm() {
  const { plan, setPlan } = useVacationStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showNoChange, setShowNoChange] = useState(false);

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

  const doSave = () => {
    setPlan({ ...form, weeklySchedule: plan?.weeklySchedule });
    setShowAlert(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.childName || !form.startDate || !form.endDate || !form.goal) return;
    if (form.endDate < form.startDate) return;

    if (plan) {
      const unchanged =
        form.childName === plan.childName &&
        form.startDate === plan.startDate &&
        form.endDate === plan.endDate &&
        form.goal === plan.goal;
      if (unchanged) {
        setShowNoChange(true);
      } else {
        setShowConfirm(true);
      }
    } else {
      doSave();
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    doSave();
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          plan={form}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {showAlert && (
        <AlertModal
          icon={<FiSave size={48} />}
          message="저장되었어요!"
          subMessage="방학 정보가 업데이트됐어요"
          buttonLabel="확인"
          onClose={() => setShowAlert(false)}
        />
      )}
      {showNoChange && (
        <AlertModal
          icon={<FiInfo size={48} />}
          message="변경사항이 없어요"
          subMessage="수정된 내용이 없어요"
          buttonLabel="확인"
          onClose={() => setShowNoChange(false)}
        />
      )}

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
    </>
  );
}
