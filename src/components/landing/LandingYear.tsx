import type { Reg } from './landingRefs'
import { EX_DATES } from './landingScenes'

// 환전 정보 줄(#fx), 지구본 위 환전 정보(#gch), 1년 날짜(#date) — 원본 그대로(예시 값)

export function LandingFx({ reg }: { reg: Reg }) {
  return (
    <div className="fx" id="fx" ref={reg('fx')}>
      <div className="row">
        <div>
          <span>
            적용 환율 (USD/KRW)<em className="exm">예시</em>
          </span>
          <b className="num">1,419.78</b>
        </div>
        <div>
          <span>환전</span>
          <b>자동 · 별도 신청 없음</b>
        </div>
        <div>
          <span>원화 확정일</span>
          <b className="num">{EX_DATES.confirmed}</b>
        </div>
      </div>
    </div>
  )
}

export function LandingDate({ reg }: { reg: Reg }) {
  return (
    <div id="date" ref={reg('date')}>
      <div className="big num" id="bigDate">
        {EX_DATES.withdraw}
      </div>
      <div className="row3" ref={reg('dateRow')}>
        <i className="fl" id="dFill" ref={reg('dFill')} />
        <div>
          <span>원화 확정일</span>
          <b className="num">{EX_DATES.confirmed}</b>
        </div>
        <div>
          <span>보유 기간</span>
          <b className="num" id="dDays">
            1년 (365일)
          </b>
        </div>
        <div>
          <span>인출 가능일부터</span>
          <b>원금 인출 가능</b>
        </div>
      </div>
    </div>
  )
}

export function LandingGch({ reg }: { reg: Reg }) {
  return (
    <div className="gch" id="gch" ref={reg('gch')}>
      <div>
        <span>예상 원화 금액 (가환전)</span>
        <b className="num">₩30,000,000</b>
      </div>
      <div>
        <span>환전 확정까지</span>
        <b className="num">D-2</b>
      </div>
      <div>
        <span>확정일</span>
        <b className="num">{EX_DATES.confirmed}</b>
      </div>
    </div>
  )
}
