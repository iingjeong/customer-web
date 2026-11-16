import { Link } from 'react-router-dom'
import type { Reg } from './landingRefs'

// 마무리 — 원본 #close. 나의 RIA 카드의 예상 절세는 오늘 구간 기준, 인출 가능일은 오늘 매도했을 때(결제·환전 확정 + 1년).
// 마지막 버튼: 로그인 상태면 "홈으로 가기"(/home), 아니면 회원가입(/login#signup) — 기존 랜딩 동작 연결
export function LandingClosing({ reg, mySave, withdraw, loggedIn }: { reg: Reg; mySave: string; withdraw: string; loggedIn: boolean }) {
  return (
    <div id="close" ref={reg('close')}>
      <h2 className="mvt" ref={reg('mvt')}>
        <span className="ln">
          <span>MORE</span>
        </span>
        <span className="ln">
          <span>VALUE</span>
        </span>
        <span className="ln">
          <span>TOMORROW</span>
        </span>
      </h2>
      <div className="myria" id="myria" ref={reg('myria')}>
        <div className="mh">
          <b>나의 RIA</b>
          <span>예시</span>
        </div>
        <table>
          <tbody>
            <tr>
              <th>매도 예정</th>
              <td className="num">30,000,000원</td>
            </tr>
            <tr>
              <th>예상 절세 (이번 구간)</th>
              <td className="num" id="mySave">
                {mySave}
              </td>
            </tr>
            <tr>
              <th>인출 가능일</th>
              <td className="num">{withdraw}</td>
            </tr>
          </tbody>
        </table>
        <Link className="go" to={loggedIn ? '/home' : '/login#signup'}>
          {loggedIn ? '홈으로 가기' : '이 금액으로 RIA 계좌 개설하기'}
        </Link>
      </div>
    </div>
  )
}
