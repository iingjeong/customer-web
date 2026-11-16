import { useLayoutEffect } from 'react'
import { useDocumentTitle } from '../common/useDocumentTitle'

// 랜딩이 떠 있는 동안에만 html에 클래스를 붙인다(배경색은 landing.css의 html.landing-doc).
// 글꼴은 index.html의 Pretendard Variable을 그대로 쓴다(원본의 woff2는 쓰지 않음).
export function useLandingDocument(): void {
  useDocumentTitle('Returns — RIA 국내시장 복귀계좌') // 원본 index.html의 <title>
  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.add('landing-doc')
    return () => {
      root.classList.remove('landing-doc')
    }
  }, [])
}
