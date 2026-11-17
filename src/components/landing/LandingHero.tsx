import type { LandingDates } from './landingDates'
import type { Reg } from './landingRefs'

// 첫 화면 문구 — 원본 <div class="hero">. 현재 공제율·마지막 매도일·D-day는 업무일로 계산(landingDates — 확정일 기준)
export function LandingHero({ reg, dates }: { reg: Reg; dates: LandingDates }) {
  return (
    <div className="hero" id="hero" ref={reg('hero')}>
      <span className="en hx">Returns Securities · RIA</span>
      <h1>
        <span className="ln">
          <span>국내로 잇는 투자,</span>
        </span>
        <span className="ln">
          <span>내일로 이어지는 가치</span>
        </span>
      </h1>
      <div className="rule hx" />
      <p className="sub hx">해외에 있던 자산이, 국내로 돌아옵니다.</p>
      <div className="meta hx">
        <div>
          <span>현재 공제율</span>
          <b className="num" id="rate">
            {dates.rateText}
          </b>
        </div>
        <div>
          <span>매도 한도</span>
          <b className="num">5,000만 원</b>
        </div>
        <div>
          <span>마지막 매도일 {dates.lastSale}</span>
          <b className="num" id="dday">
            {dates.dday}
          </b>
        </div>
      </div>
    </div>
  )
}
