import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLayoutEffect, type RefObject } from 'react'
import type { LandingEls } from './landingRefs'
import {
  FAQ_STOP, FIT_MIN_W, GLIDE_MAX, GLIDE_MIN, GLIDE_PER_T, HDR_DIR_EPS, HDR_HOVER_Y, HDR_TOP_Y, LENIS_LERP, LENIS_WHEEL, NAV_TARGETS,
  PAST_END_BACK_SEC, SCROLL_PER_T, SCRUB, STAGE_H, STAGE_W, STOPS_BEFORE_SVC, TO_FOOTER_SEC, TOTAL,
} from './landingScenes'
import { buildTimeline, playOpening } from './landingTimeline'

// 원본 app.js의 스크롤 부분: 무대 맞춤, Lenis 부드러운 스크롤, 타임라인을 스크롤에 묶기(ScrollTrigger scrub),
// 상단 바 숨김·다시 나타남, 메뉴 클릭 이동, 발표용 키(↓ → Space PageDown 다음, ↑ ← PageUp 이전).
// @gsap/react 없이 useLayoutEffect + gsap.context()로 만들고, 페이지를 떠나면 타임라인·ScrollTrigger·Lenis·리스너를 모두 정리한다.

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const easeIO3 = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const isEditable = (el: Element | null) => !!el && (el.matches('input, textarea, select') || (el as HTMLElement).isContentEditable)

export interface MotionOptions {
  /** 시작 위치: 창 크기 변경 뒤 다시 만들 때는 타임라인 시간, 뒤로 가기 복원은 스크롤 px */
  resume: { t?: number; y?: number } | null
  /** 창 크기가 바뀌면 지금 타임라인 시간을 넘긴다(원본은 새로고침 — 여기서는 화면만 다시 만든다) */
  onResize: (t: number) => void
  /** 페이지를 떠날 때 스크롤 위치(뒤로 가기 복원용) */
  onLeave: (y: number) => void
}

export function useLandingMotion(rootRef: RefObject<HTMLElement | null>, els: { current: Partial<LandingEls> }, opts: MotionOptions): void {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const E = els.current as LandingEls
    const root = rootRef.current!
    // 연출 전 각 요소의 style·class를 적어 두었다가 정리할 때 그대로 돌려놓는다.
    // gsap.context().revert()만으로는 뒤쪽 트윈 값(예: 노트북 y 920)이 남는 경우가 있어, 개발 모드(StrictMode)처럼
    // 같은 DOM에 다시 만들 때 장면이 어긋난다
    const snap = [root, ...Array.from(root.querySelectorAll('*'))].map((el) => [el, el.getAttribute('style'), el.getAttribute('class')] as const)
    const prevRestore = history.scrollRestoration
    history.scrollRestoration = 'manual'

    // ---------- stage ----------
    let S = 1
    const fit = () => {
      S = Math.min(Math.max(innerWidth / STAGE_W, innerHeight / STAGE_H), innerWidth / FIT_MIN_W)
      E.stage.style.transform = `translate(-50%,-50%) scale(${S})`
    }
    fit()
    const lenis = new Lenis({ lerp: LENIS_LERP, wheelMultiplier: LENIS_WHEEL, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const offs: Array<() => void> = []
    const on = <K extends keyof WindowEventMap>(tg: Window | HTMLElement, ev: K, fn: (e: WindowEventMap[K]) => void) => {
      tg.addEventListener(ev, fn as EventListener)
      offs.push(() => tg.removeEventListener(ev, fn as EventListener))
    }
    let dead = false
    let ctx: gsap.Context | null = null
    let st: ScrollTrigger | null = null
    const yAt = (t: number) => (st ? st.start + (t / TOTAL) * (st.end - st.start) : 0)
    const tAt = (y: number) => (st ? ((y - st.start) / (st.end - st.start)) * TOTAL : 0)

    function init() {
      if (dead) return
      ctx = gsap.context(() => {
        const { tl, arrivals } = buildTimeline(E, S)
        st = ScrollTrigger.create({ trigger: E.pin, pin: true, start: 'top top', end: () => '+=' + Math.round(TOTAL * innerHeight * SCROLL_PER_T), scrub: SCRUB, animation: tl })

        // header: visible at the very top; hides while scrolling down; returns (translucent) on scroll up or when the pointer nears the top
        const hdr = E.hdr
        let lastY = 0, hover = false
        const hdrState = () => {
          const y = lenis.scroll, atTop = y < HDR_TOP_Y
          if (atTop || hover) hdr.classList.remove('hide')
          else if (y > lastY + HDR_DIR_EPS) hdr.classList.add('hide')
          else if (y < lastY - HDR_DIR_EPS) hdr.classList.remove('hide')
          hdr.classList.toggle('glass', !atTop)
          lastY = y
        }
        lenis.on('scroll', hdrState)
        offs.push(() => lenis.off('scroll', hdrState))
        on(window, 'mousemove', (e) => { const h = e.clientY < HDR_HOVER_Y; if (h !== hover) { hover = h; hdrState() } })
        on(hdr, 'mouseleave', () => { hover = false })

        // ---------- scroll binding + presentation keys ----------
        const STOPS = [...STOPS_BEFORE_SVC, ...arrivals, FAQ_STOP, TOTAL]
        const glide = (y: number, d: number) => lenis.scrollTo(y, { duration: clamp(GLIDE_MIN + d * GLIDE_PER_T, GLIDE_MIN, GLIDE_MAX), easing: easeIO3 })
        const navs: Array<[HTMLElement, number]> = [[E.navFlow, NAV_TARGETS.flow], [E.navTax, NAV_TARGETS.tax], [E.navSvc, arrivals[0]], [E.navFaq, NAV_TARGETS.faq]]
        navs.forEach(([a, t]) => {
          a.style.cursor = 'pointer'
          on(a, 'click', () => glide(yAt(t), Math.abs(t - tAt(scrollY))))
        })
        on(E.logo, 'click', (e) => { e.preventDefault(); lenis.scrollTo(0, { immediate: true }) }) // 원본 href="#": 맨 위로
        on(window, 'keydown', (e) => {
          const next = ['ArrowDown', 'ArrowRight', ' ', 'PageDown'].includes(e.key)
          const prev = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)
          if (!next && !prev) return
          if (isEditable(document.activeElement)) return
          e.preventDefault()
          const y = lenis.targetScroll
          if (y > st!.end + 2) { if (prev) lenis.scrollTo(st!.end, { duration: PAST_END_BACK_SEC }); return }
          const t = tAt(y)
          if (next && t >= TOTAL - 0.05) { lenis.scrollTo(document.documentElement.scrollHeight, { duration: TO_FOOTER_SEC }); return }
          const to = next ? STOPS.find((s) => s > t + 0.05) : [...STOPS].reverse().find((s) => s < t - 0.05)
          if (to !== undefined) glide(yAt(to), Math.abs(to - t))
        })

        // 시작 위치: 창 크기 변경으로 다시 만든 경우·뒤로 가기로 돌아온 경우
        const r = opts.resume
        if (r) {
          ScrollTrigger.refresh()
          const y = r.t !== undefined ? yAt(r.t) : r.y!
          lenis.resize() // 핀 자리(pin-spacer)가 생긴 뒤의 문서 높이로 — 안 하면 예전 높이에 막혀 위로 잘린다
          lenis.scrollTo(y, { immediate: true, force: true })
          st.update()
          tl.progress(st.progress) // scrub을 기다리지 않고 바로 그 장면으로
        }
        playOpening(E)
      }, root)
    }
    // 글꼴이 준비된 다음 프레임에 만든다. 개발 모드(StrictMode)는 마운트 → 정리 → 마운트를 같은 DOM에 바로 이어서 하는데,
    // 한 프레임 기다리면 첫 마운트는 정리된 뒤라 만들지 않는다(같은 요소에 타임라인을 두 번 만들었다 되돌리면 시작값이 꼬인다)
    let raf = 0
    document.fonts.ready.then(() => { if (!dead) raf = requestAnimationFrame(init) })

    // 창 크기 변경: 0.3초 동안 더 바뀌지 않으면 다시 만든다. 이어갈 장면 시간은 첫 resize 때 잰다
    // (조금 뒤면 ScrollTrigger가 새 높이로 다시 계산해 버려 같은 px이 다른 장면을 가리킨다)
    let w0 = innerWidth, h0 = innerHeight, rt = 0, tAtResize: number | null = null
    on(window, 'resize', () => {
      if (tAtResize === null) tAtResize = st ? tAt(window.scrollY) : 0
      clearTimeout(rt)
      rt = window.setTimeout(() => {
        const t = tAtResize ?? 0
        tAtResize = null
        if (Math.abs(innerWidth - w0) < 4 && Math.abs(innerHeight - h0) < 4) return
        w0 = innerWidth; h0 = innerHeight
        opts.onResize(t)
      }, 300)
    })

    return () => {
      dead = true
      clearTimeout(rt)
      cancelAnimationFrame(raf)
      opts.onLeave(lenis.scroll)
      offs.forEach((f) => f())
      ctx?.revert() // 타임라인·ScrollTrigger(핀 포함)·초기 상태 되돌림
      snap.forEach(([el, st_, cl]) => {
        if (st_ === null) el.removeAttribute('style')
        else el.setAttribute('style', st_)
        if (cl === null) el.removeAttribute('class')
        else el.setAttribute('class', cl)
      })
      lenis.destroy()
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33) // GSAP 기본값으로
      history.scrollRestoration = prevRestore
    }
    // 마운트 때 한 번만 만든다(창 크기 변경은 부모가 key를 바꿔 다시 마운트)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
