import { useEffect, useState } from 'react'
import { takeLogoutNotice } from './landingSession'

// 로그아웃 안내(원본에 없음 — 기존 랜딩 동작 유지). 3초 뒤 사라진다
export function LandingNotice() {
  const [show, setShow] = useState(takeLogoutNotice)
  useEffect(() => {
    if (!show) return
    const id = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(id)
  }, [show])
  return show ? (
    <div id="ntc" role="status">
      30분이 지나 안전하게 로그아웃됐어요
    </div>
  ) : null
}
