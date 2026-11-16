import type { Reg } from './landingRefs'

// 무대 밖까지 늘어난 배경 레이어(.bleed) — 원본 #dawn, #night, #photo, #ph11

export function LandingDawn({ reg }: { reg: Reg }) {
  return (
    <div className="bleed" id="dawn" ref={reg('dawn')}>
      <div className="img" id="dawnImg" ref={reg('dawnImg')} />
      <div className="shade" />
    </div>
  )
}

export function LandingNight({ reg }: { reg: Reg }) {
  return <div className="bleed" id="night" ref={reg('night')} />
}

/** 첫 화면 사진 — 줄어들며 노트북 화면이 된다 */
export function LandingPhoto({ reg }: { reg: Reg }) {
  return (
    <div className="bleed" id="photo" ref={reg('photo')}>
      <div className="img" id="photoImg" ref={reg('photoImg')} />
      <div className="shade" id="shade" ref={reg('shade')} />
    </div>
  )
}

/** 마무리 장면 사진 */
export function LandingClosingPhoto({ reg }: { reg: Reg }) {
  return (
    <div className="bleed" id="ph11" ref={reg('ph11')}>
      <div className="img" id="ph11i" ref={reg('ph11i')} />
      <div className="shade" />
    </div>
  )
}
