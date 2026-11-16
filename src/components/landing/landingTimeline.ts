import gsap from 'gsap'
import type { LandingEls } from './landingRefs'
import {
  AMT_BIG, AMT_CENTER_Y, AMT_FONT, CLIP_BLEED, DATE_FROM_SCALE, GLOBE, GLOBE_ZOOM, KK_WALK, KRW_DIGIT_GAP, LAP_DROP_Y, LAP_SCREEN, LAP_SVC,
  FAQ_CLICK, OPENING, STAGE_H, STAGE_W, STEP_COUNT_DUR, SVC, T, TAG_FONT, TAG_LIFT, TOTAL, inkAt,
} from './landingScenes'

// 원본 app.js의 init() 중 "초기 상태 + 타임라인 하나 + 오프닝"을 순서 그대로 옮겼다.
// 요소는 모두 ref 표(E)에서 꺼내고, 여러 개를 한꺼번에 움직일 때는 등록된 요소 안에서만 찾는다(q).
// gsap.context 안에서 불러야 페이지를 떠날 때 한 번에 되돌릴 수 있다(useLandingMotion).

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const q = (el: Element, sel: string): HTMLElement[] => Array.from(el.querySelectorAll<HTMLElement>(sel))

export interface BuiltTimeline {
  tl: gsap.core.Timeline
  arrivals: number[] // 서비스 장면에서 끼루가 각 칸에 도착한 시점(발표 멈춤 지점)
}

/** S = 지금 무대 배율(화면 좌표를 무대 좌표로 바꿀 때) */
export function buildTimeline(E: LandingEls, S: number): BuiltTimeline {
  const color = (name: string) => getComputedStyle(E.stage).getPropertyValue(name).trim()
  const B = CLIP_BLEED, SCR = LAP_SCREEN
  const ins = (o: typeof SCR) => `inset(${o.t + B}px ${o.r + B}px ${o.b + B}px ${o.l + B}px)`
  const toStage = (el: Element) => {
    const r = el.getBoundingClientRect(), s = E.stage.getBoundingClientRect()
    return { x: (r.left - s.left) / S, y: (r.top - s.top) / S }
  }

  const sa = toStage(E.scrAmt)
  const amt = E.amt
  gsap.set(amt, { fontSize: AMT_FONT, x: sa.x, y: sa.y, scale: 1, autoAlpha: 0 })
  const aw = amt.offsetWidth, kw = E.krw.offsetWidth, BIG = AMT_BIG
  const CENTER = { x: STAGE_W / 2 - (aw * BIG) / 2, y: AMT_CENTER_Y }
  const G = { x: GLOBE.x, y: GLOBE.y, s: GLOBE.size / GLOBE.view }
  const arc = E.arcNY as unknown as SVGPathElement, arcTK = E.arcTK as unknown as SVGPathElement
  const AL = arc.getTotalLength(), TKL = arcTK.getTotalLength()
  const ny = arc.getPointAtLength(0), se = arc.getPointAtLength(AL)
  const TAGS = TAG_FONT / AMT_FONT

  const HD = [E.hO, E.hD, E.h1, E.h2, E.h3, E.h4, E.hT, E.hV, E.hF]
  const svs = q(E.svs, '.sv')

  // ---------- initial state ----------
  gsap.set(E.photo, { clipPath: 'inset(0px 0px 0px 0px)' })
  gsap.set(E.lap, { autoAlpha: 0 })
  gsap.set(E.U1, { autoAlpha: 1 })
  gsap.set([E.U2, E.U3, ...svs], { autoAlpha: 0 })
  gsap.set(E.seal, { autoAlpha: 0, scale: 1.4 })
  gsap.set(E.knob, { left: '0%' })
  gsap.set(q(E.U2, '.qr .b'), { scaleX: 0 })
  gsap.set(E.qres, { autoAlpha: 0, y: 12 })
  gsap.set(HD, { autoAlpha: 0 })
  gsap.set(HD.flatMap((h) => q(h, '.ln>span')), { yPercent: 115 })
  gsap.set(HD.flatMap((h) => [...q(h, '.en'), ...q(h, 'p')]), { autoAlpha: 0, y: 16 })
  gsap.set(E.krw, { autoAlpha: 0 })
  gsap.set(E.fx, { autoAlpha: 0, y: 20 })
  gsap.set(E.gch, { autoAlpha: 0, y: 16 })
  gsap.set(E.globe, { autoAlpha: 0, y: 760, scale: 0.92, transformOrigin: '50% 50%' })
  gsap.set([E.lNY, E.lSE, E.lTK], { autoAlpha: 0 })
  gsap.set(arc, { strokeDasharray: AL, strokeDashoffset: AL })
  gsap.set(arcTK, { strokeDasharray: TKL, strokeDashoffset: TKL })
  gsap.set(E.tag, { autoAlpha: 0, x: ny.x * G.s, y: ny.y * G.s })
  gsap.set(E.date, { autoAlpha: 0 })
  gsap.set(E.dateRow, { autoAlpha: 0, y: 20 })
  gsap.set(E.tax, { autoAlpha: 0 })
  gsap.set(E.save, { autoAlpha: 0, y: 24 })
  gsap.set(E.cA, { autoAlpha: 0, y: 24 })
  gsap.set(E.sLbl, { autoAlpha: 0 })
  gsap.set([...Array.from(E.taxRow.children), E.note], { autoAlpha: 0, y: 16 })
  gsap.set(E.svl, { autoAlpha: 0, y: 20 })
  gsap.set(E.faq, { autoAlpha: 1, pointerEvents: 'none' }) // 클릭은 FAQ 장면에서만(FAQ_CLICK)
  gsap.set(Array.from(E.faq.children), { autoAlpha: 0, y: 26 })
  gsap.set(E.ph11, { clipPath: 'inset(1680px 0px 0px 0px)' })
  gsap.set(E.close, { autoAlpha: 0 })
  gsap.set(q(E.mvt, '.ln>span'), { yPercent: 110 })
  gsap.set(E.myria, { autoAlpha: 0, y: 40 })

  // ---------- mascot ----------
  const W = KK_WALK
  let lastW = -1, dir = 1
  function walk(w: number) {
    if (w > lastW + 1e-4) dir = 1
    else if (w < lastW - 1e-4) dir = -1
    lastW = w
    const u = w - Math.floor(w), amp = w >= W.lastW ? 0 : Math.sin(Math.PI * u)
    const ph = w * Math.PI * 4, s = Math.sin(ph), c = Math.cos(ph)
    gsap.set(E.kk, { left: W.left0 + w * (W.span / 6) - W.offset + '%', scaleX: dir, opacity: clamp((w + 1) * 2, 0, 1) * clamp((W.fadeEnd - w) * 2, 0, 1) })
    gsap.set(E.kkB, { rotation: amp * W.tilt * s, y: -amp * W.bob * Math.abs(s) })
    gsap.set(E.kkL, { x: amp * W.stepX * c, y: -amp * W.stepY * Math.max(0, s) })
    gsap.set(E.kkR, { x: -amp * W.stepX * c, y: -amp * W.stepY * Math.max(0, -s) })
    const fo = clamp(1 - amp * W.faceK, 0, 1)
    E.kkF.style.opacity = String(fo)
    E.kkS.style.opacity = String(1 - fo)
  }
  walk(-1)

  // ---------- one timeline ----------
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
  const Tw = (t: gsap.TweenTarget, v: gsap.TweenVars, p: number) => tl.to(t, v, p)
  const head = (el: HTMLElement, t: number) => {
    Tw(el, { autoAlpha: 1, y: 0, duration: 0.01 }, t)
    Tw(q(el, '.en'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, t)
    Tw(q(el, '.ln>span'), { yPercent: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, t + 0.05)
    Tw(q(el, 'h2'), { filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }, t + 0.05)
    const p = q(el, 'p')
    if (p.length) Tw(p, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, t + 0.35)
  }
  const headOut = (el: HTMLElement, t: number) => Tw(el, { autoAlpha: 0, y: -40, duration: 0.4, ease: 'power2.in' }, t)
  const swap = (a: HTMLElement, b: HTMLElement, t: number) => {
    Tw(a, { autoAlpha: 0, duration: 0.25, ease: 'none' }, t)
    Tw(b, { autoAlpha: 1, duration: 0.25, ease: 'none' }, t + 0.05)
  }

  // S0 → S1: the opening photo becomes the laptop screen (our web)
  Tw(E.hero, { autoAlpha: 0, y: -60, duration: 0.6, ease: 'power2.in' }, T.heroOut)
  Tw(E.photo, { clipPath: ins(SCR), duration: 1.3 }, T.photoShrink)
  Tw(E.photoImg, { scale: 0.62, duration: 1.3 }, T.photoShrink)
  Tw(E.shade, { autoAlpha: 0, duration: 0.8 }, T.shadeOut)
  Tw(E.lap, { autoAlpha: 1, duration: 0.35, ease: 'none' }, T.lapIn)
  Tw(E.photo, { autoAlpha: 0, duration: 0.45, ease: 'none' }, T.photoOut)
  head(E.hO, T.hOpen)
  Tw(E.seal, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'expo.out' }, T.seal)
  Tw(E.fil, { scaleX: 0.6, duration: 1.0 }, T.limitFill)
  Tw(E.knob, { left: '60%', duration: 1.0 }, T.limitFill)

  // S2 deposit
  headOut(E.hO, T.deposit)
  swap(E.U1, E.U2, T.deposit)
  head(E.hD, T.hDeposit)
  Tw(q(E.U2, '.qr .b'), { scaleX: 1, duration: 0.5, stagger: 0.12, ease: 'expo.out' }, T.qtyBars)
  Tw(q(E.U2, '.qr:not(.mn)'), { opacity: 0.35, duration: 0.3 }, T.qtyDim)
  Tw(E.qres, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, T.qtyResult)

  // S3 sell
  headOut(E.hD, T.sell)
  swap(E.U2, E.U3, T.sell)
  head(E.h1, T.hSell)
  const os = q(E.ost, 'span'), ov = { v: 0 }
  Tw(ov, { v: 4, duration: STEP_COUNT_DUR, ease: 'none', onUpdate() { os.forEach((s, i) => s.classList.toggle('on', ov.v > i + 0.01)) } }, T.steps)

  // S3 → exchange: the amount leaves the screen
  headOut(E.h1, T.sellOut)
  tl.set(amt, { autoAlpha: 1 }, T.amtShow)
  tl.set(E.scrAmt, { opacity: 0 }, T.amtShow)
  Tw(amt, { x: CENTER.x, y: CENTER.y, scale: BIG, duration: 1.0, ease: 'expo.inOut' }, T.amtFly)
  Tw(E.lap, { y: LAP_DROP_Y, duration: 0.9, ease: 'power3.in' }, T.amtFly)
  Tw(E.night, { opacity: 1, duration: 0.45, ease: 'none' }, T.night)
  Tw(amt, { color: color('--landing-v2-white'), duration: 0.5, ease: 'none' }, T.amtWhite)
  head(E.h2, T.hExchange)
  Tw(E.usd, { yPercent: -110, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, T.usdOut)
  tl.set(E.krw, { autoAlpha: 1 }, T.krwRoll)
  q(E.krw, '.dg i').forEach((col, k) => {
    const d = col.dataset.d
    if (d === undefined) {
      gsap.set(col, { yPercent: 100 })
      Tw(col, { yPercent: 0, duration: 0.5, ease: 'expo.out' }, T.krwRoll + k * KRW_DIGIT_GAP)
      return
    }
    Tw(col, { yPercent: -((10 + +d) / 20) * 100, duration: 1.0, ease: 'expo.out' }, T.krwRoll + k * KRW_DIGIT_GAP)
  })
  Tw(amt, { x: STAGE_W / 2 - (kw * BIG) / 2, duration: 0.6, ease: 'power2.inOut' }, T.krwRoll)
  Tw(E.fx, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, T.fx)

  // homecoming
  headOut(E.h2, T.homecoming)
  Tw(E.fx, { autoAlpha: 0, y: 20, duration: 0.4, ease: 'power2.in' }, T.homecoming)
  Tw(E.globe, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out' }, T.homecoming)
  head(E.h3, T.hHome)
  const nyS = { x: G.x + ny.x * G.s, y: G.y + ny.y * G.s }
  Tw(amt, { x: nyS.x - (kw * TAGS) / 2, y: nyS.y - TAG_LIFT, scale: TAGS, duration: 0.9 }, T.amtToNY)
  Tw(amt, { fontWeight: 600, duration: 0.01 }, T.amtWeight)
  Tw([E.lNY, E.lTK], { autoAlpha: 1, duration: 0.3, stagger: 0.1 }, T.cityLabels)
  Tw(E.gch, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, T.gch)
  tl.set(E.tag, { autoAlpha: 1 }, T.tag)
  tl.set(amt, { autoAlpha: 0 }, T.tag)
  const pv = { p: 0 }
  Tw(arc, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut' }, T.arcNY)
  Tw(arcTK, { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' }, T.arcTK)
  Tw(pv, { p: 1, duration: 1.6, ease: 'power1.inOut', onUpdate() { const pt = arc.getPointAtLength(pv.p * AL); gsap.set(E.tag, { x: pt.x * G.s, y: pt.y * G.s }) } }, T.arcNY)
  Tw(E.lSE, { autoAlpha: 1, duration: 0.3 }, T.seoul)

  // one year
  headOut(E.h3, T.year)
  Tw(E.gch, { autoAlpha: 0, duration: 0.3 }, T.year)
  Tw(q(E.tag, '.t'), { autoAlpha: 0, duration: 0.3 }, T.year)
  Tw(E.globe, { scale: GLOBE_ZOOM, autoAlpha: 0, transformOrigin: `${(se.x / GLOBE.view) * 100}% ${(se.y / GLOBE.view) * 100}%`, duration: 0.9, ease: 'power2.in' }, T.globeZoom)
  const seS = { x: G.x + se.x * G.s, y: G.y + se.y * G.s }
  tl.set(E.date, { autoAlpha: 1, x: seS.x - STAGE_W / 2, y: seS.y - STAGE_H / 2, scale: DATE_FROM_SCALE }, T.dateSet)
  Tw(E.date, { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'expo.out' }, T.dateIn)
  head(E.h4, T.hYear)
  Tw(E.dateRow, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, T.dateRow)
  Tw(E.dFill, { scaleX: 1, duration: 1.5, ease: 'power1.inOut' }, T.dawn)
  // a year passes as light: night → dawn → morning, the date never moves
  tl.set(E.dawn, { opacity: 1 }, T.dawnOn)
  Tw(E.night, { opacity: 0, duration: 1.5, ease: 'power1.inOut' }, T.dawn)
  Tw(E.dawnImg, { scale: 1.06, duration: 0.01 }, T.dawnImgReset)
  Tw(E.dawnImg, { scale: 1, duration: 2.0, ease: 'power2.out' }, T.dawn)

  // tax
  const t7 = T.t7
  headOut(E.h4, t7)
  Tw(E.date, { autoAlpha: 0, y: -120, duration: 0.5, ease: 'power2.in' }, t7)
  Tw(E.tax, { autoAlpha: 1, duration: 0.01 }, t7 + 0.3)
  head(E.hT, t7 + 0.3)
  Tw(E.dawn, { opacity: 0, duration: 0.5, ease: 'none' }, t7 + 0.05)
  Tw(E.cA, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, t7 + 0.6)
  Tw(E.cutl, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, t7 + 1.4)
  Tw(E.cA, { scale: 0.26, y: -64, color: color('--landing-v2-cut'), duration: 0.6, ease: 'power3.inOut' }, t7 + 1.9)
  Tw(E.cutl, { scaleX: 0.27, y: -140, duration: 0.6, ease: 'power3.inOut', transformOrigin: '50% 50%' }, t7 + 1.9)
  Tw(E.save, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, t7 + 2.2)
  Tw(E.sLbl, { autoAlpha: 1, duration: 0.4 }, t7 + 2.45)
  Tw(Array.from(E.taxRow.children), { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }, t7 + 1.0)
  Tw(E.note, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, t7 + 1.6)

  // services: the same laptop comes back; Kkiru walks along the lid
  const t8 = T.t8
  headOut(E.hT, t8)
  Tw(E.tax, { autoAlpha: 0, y: -80, duration: 0.45, ease: 'power2.in' }, t8)
  tl.set(E.U3, { autoAlpha: 0 }, t8 + 0.2)
  tl.set(svs[0], { autoAlpha: 1 }, t8 + 0.2)
  tl.set(E.lap, { y: LAP_DROP_Y, x: LAP_SVC.x, scale: LAP_SVC.scale, transformOrigin: '50% 0%' }, t8 + 0.2)
  Tw(E.lap, { y: LAP_SVC.y, duration: 1.0, ease: 'expo.out' }, t8 + 0.3)
  head(E.hV, t8 + 0.5)
  Tw(E.svl, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, t8 + 0.8)
  const items = q(E.svl, 'li')
  items[0].classList.add('on')
  const wv = { w: -1 }
  const walkTo = (w: number, t: number, d: number) => Tw(wv, { w, duration: d, ease: 'none', onUpdate: () => walk(wv.w) }, t)
  walkTo(0, t8 + SVC.firstWalk, SVC.walk)
  const arrivals = [t8 + SVC.firstArrive]
  for (let i = 1; i < SVC.count; i++) {
    const t = t8 + SVC.start + (i - 1) * SVC.gap, arrive = t + SVC.walk
    arrivals.push(arrive + SVC.stopAfter)
    walkTo(i, t, SVC.walk)
    Tw(svs[i - 1], { autoAlpha: 0, duration: 0.12 }, arrive - 0.06)
    Tw(svs[i], { autoAlpha: 1, duration: 0.12 }, arrive - 0.02)
    const o = { v: 0 }
    Tw(o, { v: 1, duration: 0.01, onUpdate() { items.forEach((li, j) => li.classList.toggle('on', j === (o.v >= 1 ? i : i - 1))) } }, arrive - 0.06)
  }

  // FAQ
  const t9 = T.t9
  headOut(E.hV, t9)
  Tw(E.svl, { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power2.in' }, t9)
  walkTo(SVC.exitW, t9, SVC.walk)
  Tw(E.lap, { y: LAP_DROP_Y, duration: 0.7, ease: 'power3.in' }, t9 + 0.15)
  head(E.hF, t9 + 0.6)
  Tw(Array.from(E.faq.children), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, t9 + 0.8)
  tl.set(E.faq, { pointerEvents: 'auto' }, FAQ_CLICK.on)

  // closing
  const t10 = T.t10
  headOut(E.hF, t10)
  tl.set(E.faq, { pointerEvents: 'none' }, FAQ_CLICK.off)
  Tw(Array.from(E.faq.children), { autoAlpha: 0, y: -30, duration: 0.4, stagger: 0.02, ease: 'power2.in' }, t10)
  Tw(E.ph11, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1.1 }, t10 + 0.1)
  Tw(E.ph11i, { scale: 1.04, duration: 0.01 }, t10)
  Tw(E.ph11i, { scale: 1, duration: 1.6, ease: 'power2.out' }, t10 + 0.1)
  Tw(E.close, { autoAlpha: 1, duration: 0.01 }, t10 + 0.8)
  Tw(q(E.mvt, '.ln>span'), { yPercent: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, t10 + 0.8)
  Tw(E.myria, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' }, t10 + 1.2)
  tl.to({}, { duration: 0.3 }, TOTAL - 0.3)

  tl.eventCallback('onUpdate', () => { E.hdr.classList.toggle('ink', inkAt(tl.time())) })
  return { tl, arrivals }
}

/** 오프닝(스크롤과 무관하게 한 번): 사진이 천천히 당겨지고 제목이 한 줄씩 올라온다 */
export function playOpening(E: LandingEls): void {
  const lines = q(E.hero, 'h1 .ln>span'), hx = q(E.hero, '.hx'), en = q(E.hero, '.en')
  gsap.set(lines, { yPercent: 112 })
  gsap.set([...hx, ...en], { autoAlpha: 0, y: 18 })
  gsap.set(E.photoImg, { scale: 1.1 })
  gsap.timeline({ delay: OPENING.delay })
    .to(E.photoImg, { scale: 1, duration: OPENING.photo, ease: 'power2.out' }, 0)
    .to(en, { autoAlpha: 0.85, y: 0, duration: 0.9, ease: 'power2.out' }, OPENING.en)
    .to(lines, { yPercent: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out' }, OPENING.title)
    .to(hx, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power2.out' }, OPENING.rest)
}
