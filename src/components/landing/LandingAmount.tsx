import type { Reg } from './landingRefs'

// 주인공 금액 — 원본 #amt. 노트북 화면의 달러 금액이 빠져나와 원화로 굴러 바뀐 뒤 지구본으로 날아간다.
// 원화 숫자는 칸마다 0~9를 두 번 세운 기둥(.dg i)을 위로 굴린다(원본 app.js가 innerHTML로 만들던 것을 그대로 그림).
const KRW = '₩30,000,000'
const COL = '01234567890123456789'.split('')

export function LandingAmount({ reg }: { reg: Reg }) {
  return (
    <div id="amt" className="num" ref={reg('amt')}>
      <span id="usd" ref={reg('usd')}>
        $21,130.00
      </span>
      <span id="krw" ref={reg('krw')}>
        {KRW.split('').map((c, i) =>
          /\d/.test(c) ? (
            <span className="dg" key={i}>
              <i data-d={c}>
                {COL.map((d, j) => (
                  <b key={j}>{d}</b>
                ))}
              </i>
            </span>
          ) : (
            <span className="dg" key={i}>
              <i>
                <b>{c}</b>
              </i>
            </span>
          ),
        )}
      </span>
    </div>
  )
}
