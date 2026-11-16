import { useState } from 'react'
import { riaTax, TAX_GENERAL, taxSave, wonX } from './landingDates'
import type { Reg } from './landingRefs'

// 세금 장면 — 원본 #tax. 일반 계좌 세액이 잘려 RIA 세액만 남는다(세액 계산은 landingDates의 riaTax·taxSave).
// 공제율 버튼 3개: 처음엔 오늘 날짜의 구간이 선택돼 있고(" · 오늘" 표시), 누르면 그 구간으로 다시 계산한다(원본 setRate).
const BANDS = [
  { r: 1, label: '1~5월 결제분', v: '공제 100%' },
  { r: 0.8, label: '6~7월 결제분', v: '공제 80%' },
  { r: 0.5, label: '8~12월 결제분', v: '공제 50%' },
]

export function LandingTax({ reg, todayRate }: { reg: Reg; todayRate: number }) {
  const [rate, setRate] = useState(todayRate)
  return (
    <div id="tax" ref={reg('tax')}>
      <div className="cutw">
        <span className="lbl" id="sLbl" ref={reg('sLbl')}>
          RIA 계좌 세액
        </span>
        <div className="big num cA" id="cA" ref={reg('cA')}>
          {wonX(TAX_GENERAL)}
        </div>
        <i className="cutl" id="cutl" ref={reg('cutl')} />
        <div className="big num" id="save" ref={reg('save')}>
          {wonX(riaTax(rate))}
        </div>
      </div>
      <div className="row3 dk" id="taxRow" ref={reg('taxRow')}>
        {BANDS.map((b) => (
          <button className={b.r === rate ? 'bn on' : 'bn'} data-r={b.r} key={b.r} onClick={() => setRate(b.r)}>
            <span>
              {b.label}
              {b.r === todayRate ? ' · 오늘' : ''}
            </span>
            <b className="num">{b.v}</b>
          </button>
        ))}
        <div className="vs">
          <span>
            일반 계좌 <s className="num">{wonX(TAX_GENERAL)}</s>
          </span>
          <b className="num">
            절세 <em id="riaTax">{wonX(taxSave(rate))}</em>
          </b>
        </div>
      </div>
      <p className="note" ref={reg('note')}>
        RIA 계좌 세액 예시 · 매도 3,000만 원, 양도차익 1,000만 원, 기본공제 250만 원, 세율 22% 가정 예시. 다른 계좌에서 해외주식을 순매수하면 공제가 줄어요 (예: 공제 인정 82%).
      </p>
    </div>
  )
}
