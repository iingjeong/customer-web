import type { Reg } from './landingRefs'

// 서비스 목록 7줄 — 원본 #svl. 끼루가 노트북 위 해당 칸에 도착하면 그 줄이 켜진다(.on)
const SERVICES = ['매도 가이드', '끼루 절세 브리핑', '오늘의 종목', '주식 패키지 만들기 도우미', '끼루 뉴스 브리핑', '끼루 AI 챗봇', '커뮤니티와 끼루 답변']

export function LandingServices({ reg }: { reg: Reg }) {
  return (
    <ol className="svl" id="svl" ref={reg('svl')}>
      {SERVICES.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ol>
  )
}
