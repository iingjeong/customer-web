import { C, FIXED } from '../../data/returns'
import { F } from '../../lib/calc'
import { getBusinessToday } from '../../lib/clock'
import { EX_GAIN } from './landingScenes'

// 오늘 날짜로 정해지는 값과 세금 예시 계산.
// "오늘"은 원본의 new Date() 대신 getBusinessToday()(서버 업무일, 서버가 꺼져 있으면 목업 날짜)를 쓴다.

/* ===== 세금 예시(양도차익 1,000만 원) — 기존 웹 세액 계산(F.tax)과 같은 공식·상수(C.BASIC_DEDUCTION, C.TAX_RATE) =====
   일반 계좌 세액 = max(0, 양도차익 − 250만) × 22%
   RIA 세액 = max(0, 양도차익 − 양도차익 × 공제율 − 250만) × 22%   ← 공제율은 기본공제를 빼기 전 양도차익에 곱한다
   절세액 = 일반 계좌 세액 − RIA 세액 */
export const TAX_GENERAL = Math.round(Math.max(0, EX_GAIN - C.BASIC_DEDUCTION) * C.TAX_RATE) // 1,650,000
export const riaTax = (rate: number): number => Math.round(Math.max(0, EX_GAIN - EX_GAIN * rate - C.BASIC_DEDUCTION) * C.TAX_RATE)
export const taxSave = (rate: number): number => TAX_GENERAL - riaTax(rate)

export interface LandingDates {
  rate: number // 오늘 팔면 받는 공제율(1 / 0.8 / 0.5) — 확정일(결제일) 구간
  rateText: string // "50%"
  lastSale: string // 2026년 혜택을 받는 마지막 매도일 "12/29"
  dday: string // 마지막 매도일까지 "D-41"
  mySave: string // 나의 RIA 카드의 예상 절세 "1,100,000원"
  withdraw: string // 나의 RIA 카드의 인출 가능일 "2027.11.20" — 오늘 매도 → 확정일(2영업일 뒤) + 1년
}

// 기존 웹 계산(calc.ts)을 그대로 쓴다 — 백엔드와 같은 규칙: 확정일 = 매도일 + 2영업일(주말·공휴일 제외), 공제 구간·세액 연도는 확정일 기준
export function landingDates(today: string = getBusinessToday()): LandingDates {
  const rate = F.saleBand(F.biz()).rate
  // 2026년 확정분까지 공제(백엔드 YEAR(final_at)) → 확정일이 12-31(가입 마감일) 안에 드는 마지막 매도일
  const last = F.lastSaleDay(FIXED.JOIN_END)
  const [, lm, ld] = last.split('-').map(Number)
  return {
    rate,
    rateText: Math.round(rate * 100) + '%',
    lastSale: lm + '/' + ld,
    dday: 'D-' + Math.max(0, F.days(today, last)),
    mySave: F.won(taxSave(rate)) + '원',
    withdraw: F.dot(F.addYears(F.settleOf(F.biz()), 1)),
  }
}

export const wonX = (v: number): string => '₩' + Math.round(v).toLocaleString('ko-KR')
