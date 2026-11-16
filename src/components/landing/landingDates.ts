import { C } from '../../data/returns'
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
  rate: number // 오늘 결제분 공제율(1 / 0.8 / 0.5)
  rateText: string // "50%"
  dday: string // 혜택 마감(2026-12-31)까지 "D-43"
  mySave: string // 나의 RIA 카드의 예상 절세 "1,100,000원"
  withdraw: string // 나의 RIA 카드의 인출 가능일 "2027.11.20" — 오늘 매도 → 결제·환전 확정(2영업일 뒤) + 1년
}

export function landingDates(today: string = getBusinessToday()): LandingDates {
  const [y, m, d] = today.split('-').map(Number)
  const now = new Date(y, m - 1, d)
  let frac: number
  if (y < 2026) frac = 0.01
  else if (y > 2026) frac = 0.995
  else frac = (now.getMonth() + (now.getDate() - 1) / new Date(2026, now.getMonth() + 1, 0).getDate()) / 12
  const month = Math.floor(frac * 12) + 1
  const rate = month <= 5 ? 1 : month <= 7 ? 0.8 : 0.5
  const days = Math.max(0, Math.ceil((new Date(2026, 11, 31).getTime() - now.getTime()) / 864e5))
  // 기존 웹 날짜 규칙(calc.ts dates()): 체결일(기준 영업일) → 2영업일 뒤 결제·환전 확정 → 1년 뒤 인출 가능
  const confirmed = F.bizAdd(F.biz(), 2)
  return {
    rate,
    rateText: Math.round(rate * 100) + '%',
    dday: 'D-' + days,
    mySave: F.won(taxSave(rate)) + '원',
    withdraw: F.dot(F.addYears(confirmed, 1)),
  }
}

export const wonX = (v: number): string => '₩' + Math.round(v).toLocaleString('ko-KR')
