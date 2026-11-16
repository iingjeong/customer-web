// 랜딩이 쓰는 sessionStorage 값 — 기존 랜딩과 같은 키(returns-login, returns-landing-scroll, returns-logout-notice)

/** 로그인 표시 — 로그인 폼의 setLoginSession이 같은 키를 씀 */
export const readLandingLoggedIn = (): boolean => {
  try {
    return sessionStorage.getItem('returns-login') === '1'
  } catch {
    return false
  }
}

/* 뒤로 가기(POP)로 돌아왔을 때 이전 스크롤 위치 복원 — 기록(history) 항목별로 하나 */
const SCROLL_KEY = 'returns-landing-scroll'

export function readSavedScroll(historyKey: string): number | null {
  try {
    const v = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || 'null')
    return v && v.key === historyKey && Number.isFinite(v.y) ? v.y : null
  } catch {
    return null
  }
}

export function writeSavedScroll(historyKey: string, y: number): void {
  try {
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ key: historyKey, y }))
  } catch {
    /* 저장 불가 환경이면 복원만 건너뜀 */
  }
}

/* 30분 무조작 로그아웃으로 돌아왔을 때 안내 한 번(TopBar가 키를 남김) */
const LOGOUT_NOTICE_KEY = 'returns-logout-notice'
let lastNoticeAt = -1e9 // 개발 모드(StrictMode) 재마운트에서도 안내가 보이도록

export function takeLogoutNotice(): boolean {
  try {
    if (sessionStorage.getItem(LOGOUT_NOTICE_KEY) === '1') {
      sessionStorage.removeItem(LOGOUT_NOTICE_KEY)
      lastNoticeAt = performance.now()
      return true
    }
    return performance.now() - lastNoticeAt < 500
  } catch {
    return false
  }
}
