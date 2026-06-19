# 알찬방학 (Alchan Vacation)

## 프로젝트 소개

알찬방학은 학부모가 아이의 방학 계획을 만들고 관리할 수 있는 서비스입니다.

이 프로젝트는 React + TypeScript 학습 및 복습을 위한 개인 프로젝트이며,
최종적으로 Google Play 출시를 목표로 합니다.

---

## 기술 스택

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- LocalStorage

---

## 개발 원칙

- MVP 우선 개발
- 기능 구현 후 리팩토링
- 과도한 추상화 금지
- TypeScript 타입 우선 작성
- 모바일 우선 UI
- 파일 역할이 명확해야 함
- 컴포넌트는 가능한 작게 분리
- 유지보수하기 쉬운 구조를 우선 고려

---

## 폴더 구조 원칙

- pages : 화면 단위
- components : 공통 UI 컴포넌트
- features : 기능별 컴포넌트 (도메인 단위 하위 폴더로 구분)
- routes : 라우팅 설정
- stores : Zustand 상태관리
- types : 타입 정의
- utils : 공통 함수 및 LocalStorage 관리

현재 구조

```
src/
├─ pages/
│   ├─ HomePage.tsx
│   └─ CalendarPage.tsx
├─ components/
│   ├─ Button.tsx
│   ├─ Input.tsx
│   ├─ BottomNavigation.tsx
│   ├─ AlertModal.tsx
│   ├─ ConfirmModal.tsx
│   └─ TimePickerModal.tsx
├─ features/
│   ├─ vacation/
│   │   ├─ VacationForm.tsx
│   │   ├─ VacationPreviewCard.tsx
│   │   ├─ WeeklyScheduleForm.tsx
│   │   ├─ DayScheduleEditor.tsx
│   │   ├─ RepeatTaskAdder.tsx
│   │   └─ SpecificDateTaskForm.tsx
│   ├─ calendar/
│   │   ├─ CalendarListView.tsx
│   │   ├─ CalendarMonthView.tsx
│   │   ├─ CalendarDiaryView.tsx
│   │   └─ DayDetailModal.tsx
│   └─ memo/
│       └─ MemoSection.tsx
├─ routes/
│   └─ AppRoutes.tsx
├─ stores/
│   ├─ vacationStore.ts
│   ├─ completionStore.ts
│   └─ specificTaskStore.ts
├─ types/
│   ├─ vacation.ts
│   ├─ completion.ts
│   └─ specificTask.ts
└─ utils/
    ├─ date.ts
    └─ localStorage.ts
```

---

## 현재 MVP 목표

학부모가 아이의 방학 계획을 입력하고 관리할 수 있는 기본 기능 구현

### MVP 1단계 ✅ 완료

- 아이 이름 / 방학 기간 / 목표 입력 및 수정
- 요일별 할 일 추가 / 수정 / 삭제 (시간 선택 포함)
- 반복 할 일 여러 요일에 한 번에 추가
- Zustand + LocalStorage 상태 저장
- 저장 내용 미리보기 카드
- 캘린더: 리스트 보기 + 달력 보기 + 다이어리 보기 탭
- 날짜별 할 일 완료 체크 (게이지 + 달성 시각화)
- 오늘 날짜 자동 스크롤 및 강조 표시
- 자유 메모 (LocalStorage 자동 저장)
- 앱 진입 시 캘린더 자동 이동 (데이터 있을 때)
- 특별 할 일: 특정 날짜 1회성 일정 추가 / 수정 / 삭제 (중요 표기 포함)
- 홈 할 일 카드: 반복 할 일 / 특별 할 일 탭 분리
- 다이어리 보기: 날짜별 페이지 플립 UX, 스와이프 제스처 지원
- 달력 보기: 오늘 날짜 원형 표시 및 자동 스크롤, 중요 일정 ★ 표기
- 캘린더 탭 선택 상태 유지 (마지막 탭 복원)

### 현재 구현하지 않는 기능

- AI 기능
- 로그인
- 서버 연동
- DB
- React Query
- PDF 저장
- 푸시 알림
- 스티커 기능
- 다이어리 꾸미기
- 연속 달성 기록

---

## 최종 서비스 방향

알찬방학은 단순한 계획표 앱이 아니라

"방학 다이어리"

서비스를 목표로 합니다.

### 사용 흐름

1. 학부모가 방학 계획 작성
2. 아이가 매일 앱 실행
3. 오늘의 다이어리 페이지 확인
4. 할 일 체크
5. 달성 기록 저장
6. 달력에서 진행 상황 확인
7. 스티커 및 보상 획득
8. 다이어리 꾸미기

---

## 향후 기능 계획

### 다이어리

- 오늘의 할 일
- 체크리스트
- 하루 기록
- 메모

### 달력

- 달성 현황 표시
- 연속 달성 기록

### 보상 시스템

- 스티커 획득
- 다꾸 아이템
- 테마 해금

### 꾸미기

- 다이어리 스킨
- 테마 선택
- 스티커 붙이기

### AI 기능

예시 입력

"초4 여학생, 수학 복습 위주, 독서 20분, 영어 단어 30개"

↓

AI가 방학 계획 자동 생성

---

## 작업 완료 후 필수 응답

작업이 끝나면 반드시 아래 내용을 제공한다.

1. 생성/수정 파일 목록
2. 각 파일 역할 설명
3. 실행 방법
4. 다음 작업 추천

## 아이 친화적인 분위기를 위해 이모티콘대신 React Icons를 사용

단,
이모티콘과 아이콘은 과도하게 사용하지 말고
포인트 요소에만 사용한다.
향후 스티커/다이어리 시스템이 추가될 예정이므로

전체 UI는 깔끔하게 유지한다.
