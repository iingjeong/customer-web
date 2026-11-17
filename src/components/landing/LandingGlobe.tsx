import type { Reg } from './landingRefs'
import { ARC_NY, ARC_TK } from './landingGlobeData'
import { CITY_LIFT } from './landingScenes'

// 밤의 지구본과 항로(뉴욕·도쿄 → 서울), 날아가는 금액 꼬리표 — 원본 #globe
// 지구본 이미지는 원본 위치 그대로, 도시·항로·꼬리표 묶음만 CITY_LIFT만큼 위로
export function LandingGlobe({ reg }: { reg: Reg }) {
  return (
    <div id="globe" ref={reg('globe')}>
      <img src="/assets/landing/earth-globe3.webp" alt="밤의 지구 위로 뉴욕에서 서울로 이어지는 항로" />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-CITY_LIFT}px)` }}>
        <svg viewBox="0 0 2200 2200" aria-hidden="true">
          <path id="arcNY" ref={reg('arcNY')} d={ARC_NY} fill="none" style={{ stroke: 'var(--landing-v2-gold-light)' }} strokeWidth="3.2" strokeLinecap="round" />
          <path id="arcTK" ref={reg('arcTK')} d={ARC_TK} fill="none" style={{ stroke: 'var(--landing-v2-gold-light)' }} strokeOpacity=".7" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        <span className="pt" style={{ left: '87.05%', top: '44.78%' }} />
        <span className="lb" id="lNY" ref={reg('lNY')} style={{ left: '87.05%', top: '44.78%', transform: 'translate(-50%,22px)' }}>
          NEW YORK
        </span>
        <span className="pt" style={{ left: '14.27%', top: '44.78%' }} />
        <span className="lb" id="lSE" ref={reg('lSE')} style={{ left: '14.27%', top: '44.78%', transform: 'translate(-50%,22px)' }}>
          SEOUL
        </span>
        <span className="pt" style={{ left: '15.80%', top: '53.04%' }} />
        <span className="lb" id="lTK" ref={reg('lTK')} style={{ left: '15.80%', top: '53.04%', transform: 'translate(18px,-6px)' }}>
          TOKYO
        </span>
        <div id="tag" ref={reg('tag')}>
          <span className="d" />
          <span className="t num">₩30,000,000</span>
        </div>
      </div>
    </div>
  )
}
