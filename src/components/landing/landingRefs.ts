// 연출 코드가 쓰는 요소 목록. 각 부품이 ref={reg('이름')}으로 등록하고, 연출 코드는 이 표에서만 요소를 꺼낸다
// (document.querySelector를 쓰지 않는다. 여러 개를 한꺼번에 움직일 때는 등록된 요소 안에서만 찾는다).
export type LandingKey =
  // 바깥
  | 'hdr' | 'pin' | 'stage' | 'navFlow' | 'navTax' | 'navSvc' | 'navFaq' | 'logo'
  // 배경
  | 'dawn' | 'dawnImg' | 'night' | 'photo' | 'photoImg' | 'shade' | 'ph11' | 'ph11i'
  // 첫 화면
  | 'hero'
  // 장면 제목
  | 'hO' | 'hD' | 'h1' | 'h2' | 'h3' | 'h4' | 'hT' | 'hV' | 'hF'
  // 노트북
  | 'lap' | 'U1' | 'U2' | 'U3' | 'seal' | 'fil' | 'knob' | 'qres' | 'scrAmt' | 'ost' | 'svs'
  | 'kk' | 'kkB' | 'kkL' | 'kkR' | 'kkF' | 'kkS'
  // 금액·환전·지구본
  | 'amt' | 'usd' | 'krw' | 'fx' | 'globe' | 'arcNY' | 'arcTK' | 'lNY' | 'lSE' | 'lTK' | 'tag' | 'gch'
  // 1년
  | 'date' | 'dateRow' | 'dFill'
  // 세금
  | 'tax' | 'cA' | 'cutl' | 'save' | 'sLbl' | 'taxRow' | 'note'
  // 서비스·FAQ·마무리
  | 'svl' | 'faq' | 'close' | 'mvt' | 'myria'

export type LandingEls = Record<LandingKey, HTMLElement>
export type Reg = (k: LandingKey) => (el: Element | null) => void

/** 등록 함수 만들기: 요소가 생기면 표에 넣는다(사라질 때 null은 무시 — 표는 페이지와 함께 버려진다) */
export const makeReg = (box: { current: Partial<LandingEls> }): Reg => (k) => (el) => {
  if (el) box.current[k] = el as HTMLElement
}
