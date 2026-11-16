import { useRef, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import '../components/landing/landing.css'
import { landingDates } from '../components/landing/landingDates'
import { LandingFooter } from '../components/landing/LandingFooter'
import { LandingHeader } from '../components/landing/LandingHeader'
import { LandingNotice } from '../components/landing/LandingNotice'
import { makeReg, type LandingEls } from '../components/landing/landingRefs'
import { readLandingLoggedIn, readSavedScroll, writeSavedScroll } from '../components/landing/landingSession'
import { LandingStage } from '../components/landing/LandingStage'
import { useLandingDocument } from '../components/landing/useLandingDocument'
import { useLandingMotion } from '../components/landing/useLandingMotion'

// 랜딩(/) — 원본 _design/returns-landing(index.html + app.js). 옛 랜딩은 src/components/landing-legacy에 보관.
export function LandingPage() {
  useLandingDocument()
  const navType = useNavigationType()
  const { key } = useLocation()
  // 창 크기가 바뀌면 원본은 새로고침한다 — 여기서는 안쪽을 다시 마운트해 무대·타임라인을 새로 만들고 같은 장면에서 이어간다
  const [gen, setGen] = useState(0)
  const [resume, setResume] = useState<{ t?: number; y?: number } | null>(() => {
    if (navType !== 'POP') return null
    const y = readSavedScroll(key)
    return y === null ? null : { y }
  })
  return (
    <LandingBody
      key={gen}
      resume={resume}
      onResize={(t) => {
        setResume({ t })
        setGen((g) => g + 1)
      }}
      onLeave={(y) => writeSavedScroll(key, y)}
    />
  )
}

function LandingBody({ resume, onResize, onLeave }: { resume: { t?: number; y?: number } | null; onResize: (t: number) => void; onLeave: (y: number) => void }) {
  // 날짜 값·로그인 여부는 처음 한 번만 정한다(연출이 바꾸는 요소를 React가 다시 그리지 않도록)
  const [dates] = useState(() => landingDates())
  const [loggedIn] = useState(readLandingLoggedIn)
  const rootRef = useRef<HTMLDivElement>(null)
  // 연출 코드가 쓰는 요소 표(부품들이 ref={reg('이름')}으로 채움)
  const [els] = useState<{ current: Partial<LandingEls> }>(() => ({ current: {} }))
  const [reg] = useState(() => makeReg(els))
  useLandingMotion(rootRef, els, { resume, onResize, onLeave })
  return (
    <div className="landing" ref={rootRef}>
      <LandingHeader reg={reg} loggedIn={loggedIn} />
      <LandingStage reg={reg} dates={dates} loggedIn={loggedIn} />
      <LandingFooter />
      <LandingNotice />
    </div>
  )
}
