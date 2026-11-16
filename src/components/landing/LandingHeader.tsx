import { Link } from 'react-router-dom'
import { RETURNS_DATA } from '../../data/returns'
import type { Reg } from './landingRefs'

// 상단 바 — 원본 <header class="hdr">. 메뉴 4개는 누르면 해당 장면으로 미끄러져 이동(useLandingScroll이 연결).
// 오른쪽: 로그인 상태면 "○○ 님 · 홈으로" 하나(기존 랜딩 동작), 아니면 로그인·계좌 개설.
export function LandingHeader({ reg, loggedIn }: { reg: Reg; loggedIn: boolean }) {
  return (
    <header className="hdr" id="hdr" ref={reg('hdr')}>
      <div className="l">
        <a className="lg" href="#" ref={reg('logo')}>
          Returns<i>.</i>
        </a>
        <nav>
          <a ref={reg('navFlow')}>RIA 제도</a>
          <a ref={reg('navTax')}>절세 계산</a>
          <a ref={reg('navSvc')}>서비스</a>
          <a ref={reg('navFaq')}>자주 묻는 질문</a>
        </nav>
      </div>
      <div className="r">
        {loggedIn ? (
          <Link className="cta" to="/home">
            {RETURNS_DATA.CUSTOMER.name} 님 · 홈으로
          </Link>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link className="cta" to="/login#signup">
              계좌 개설
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
