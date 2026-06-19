# Changelog

---

## [0.2.0] - 2026-06-19

### Added

**캘린더 뷰 개선**
- 리스트 보기: 오늘 날짜 카드 자동 스크롤 + "오늘" 뱃지 표시
- 리스트 보기: 할 일 텍스트 클릭해도 완료 토글 (체크박스 클릭 외)
- 달력 보기: 완료된 날짜 셀 배경색 변경 (bg-orange-50)
- 달력 보기: 남은 할 일 수 셀에 표시, 완료 시 오렌지 원으로 표기
- DayDetailModal: 중앙 모달 팝업, 게이지 아래 확인 버튼 추가

**UX 개선**
- 앱 진입 시 캘린더 데이터 있으면 /calendar로 자동 이동
- 방학 정보 폼 아코디언 (저장 후 자동으로 접힘)
- 정보 수정 저장 시 ConfirmModal로 내용 확인 후 저장
- AlertModal: 저장하기/캘린더만들기 후 결과 알림 (확인 버튼 포함)

**시간 선택 피커**
- TimePickerModal: 오전/오후 토글, 시·분 직접 입력 + ▲▼ 버튼
- DayScheduleEditor, RepeatTaskAdder에 시계 아이콘 버튼으로 피커 연결
- "시간 없음" 옵션으로 시간 제거 가능

**메모 기능**
- 요일별 할 일 위에 자유 메모 섹션 추가
- 입력 즉시 LocalStorage 자동 저장, 새로고침 후에도 유지
- 전체 삭제 버튼 제공

### Fixed
- 날짜/이름 수정 후 저장 시 weeklySchedule 초기화되는 버그 수정

---

## [0.1.0] - 2026-06-18

### Added

**기초 설정**
- React + TypeScript + Vite + Tailwind CSS 프로젝트 초기화
- react-router-dom 기반 라우팅 구조 (/, /calendar)
- 하단 고정 BottomNavigation (홈/캘린더 탭)
- Button, Input 공통 컴포넌트

**방학 정보 입력**
- 아이 이름, 방학 시작일/종료일, 목표 입력 및 LocalStorage 저장
- VacationPreviewCard: 저장된 방학 정보 미리보기

**요일별 할 일 입력**
- 월~일 요일별 할 일 추가/수정/삭제
- 할 일마다 선택적 시간 입력 (HH:MM)
- RepeatTaskAdder: 반복 할 일을 평일/주말/매일 등 여러 요일에 한 번에 추가 (중복 방지)
- IME 한국어 입력 버그 수정 (onKeyDown → onKeyUp)

**캘린더 페이지**
- 리스트 보기: 방학 기간 날짜 목록, 요일별 할 일 및 시간 표시
- 달력 보기: 월간 달력 그리드 (월요일 시작), 방학 기간 강조
- 리스트/달력 탭 전환

**할 일 완료 체크**
- 날짜별 체크박스 완료 토글, LocalStorage 영속화
- 날짜 카드 진행 게이지 + 완료/전체 카운트
- 완료 시 카드 배경색 변경 (bg-orange-50)
- 달력 셀 클릭 → DayDetailModal 팝업으로 체크 가능
