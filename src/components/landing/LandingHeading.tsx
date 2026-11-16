import type { LandingKey, Reg } from './landingRefs'

// 장면 제목 — 원본 <div class="hd">(작은 영문 + 한 줄씩 올라오는 제목 + 설명). light = 어두운 배경용(.lt)
export function LandingHeading({ reg, k, en, lines, p, light }: { reg: Reg; k: LandingKey; en: string; lines: string[]; p?: string; light?: boolean }) {
  return (
    <div className={light ? 'hd lt' : 'hd'} id={k} ref={reg(k)}>
      <span className="en">{en}</span>
      <h2>
        {lines.map((l) => (
          <span className="ln" key={l}>
            <span>{l}</span>
          </span>
        ))}
      </h2>
      {p && <p>{p}</p>}
    </div>
  )
}
