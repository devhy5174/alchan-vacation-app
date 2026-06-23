// 욕설 필터 목록 — 여기서만 관리
const BAD_WORDS = [
  // 시발 계열
  "시발", "씨발", "시바", "씨바", "씨팔", "시팔", "씨빨", "시빨", "ㅅㅂ", "ㅆㅂ",
  // 새끼 계열
  "새끼", "새기", "색히", "새키", "ㅅㄲ",
  // 개새끼
  "개새끼", "개새", "개색", "개세",
  // 병신 계열
  "병신", "벙신", "ㅂㅅ",
  // 지랄
  "지랄", "ㅈㄹ",
  // 존나 계열
  "존나", "존내", "좆나", "ㅈㄴ",
  // 좆
  "좆", "ㅈ같", "좆같", "졷",
  // 미친 계열
  "미친놈", "미친년", "미친새끼", "미친",
  // 닥쳐
  "닥쳐", "닥치",
  // 찐따
  "찐따", "찐다",
  // 등신
  "등신",
  // 개소리
  "개소리",
  // 엿
  "엿먹어", "엿이나",
  // 꺼져
  "꺼져", "꺼지",
  // 죽어
  "죽어버려", "뒤져", "뒤지",
  // 창녀
  "창녀", "창년",
  // 후레자식
  "후레자식", "후레",
  // 보지
  "보지",
  // 자지
  "자지",
  // 개같은
  "개같은", "개같",
  // 빠가
  "빠가",
];

// 입력값에서 욕설을 ***로 치환
export function filterBadWords(text: string): string {
  let result = text;
  for (const word of BAD_WORDS) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "gi"), "***");
  }
  return result;
}

// 욕설 포함 여부만 확인 (필요 시 사용)
export function hasBadWords(text: string): boolean {
  const lower = text.toLowerCase();
  return BAD_WORDS.some((word) => lower.includes(word));
}
