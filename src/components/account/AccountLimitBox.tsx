import '../../styles/tokens.css'
import { Box } from '../common/Box'
import { limitValues } from './accountTaxData'
import type { SellLimitState } from './useSellLimit'
import styles from './AccountLimitBox.module.css'

interface AccountLimitBoxProps {
  className?: string
  onApply: () => void // 매도 신청 창은 다음 단계에서 연결
  limit: SellLimitState // 서버 매도 한도(이 박스만 로딩·실패 처리)
  onRetryLimit: () => void
}

// 한도 금액 표기: 만원 단위로 자른다(내림). 반올림하면 한도 5천만 원에서 1,000원만 남아도 사용 한도가 "5,000만"으로 보인다(예: 49,999,000 → 4,999만, 1,000 → 0만)
const floorMan = (n: number): string => Math.floor(n / 1e4).toLocaleString('ko-KR') + '만'
// 남은 한도: 1만 원 미만은 원 단위 그대로(1,000), 1만 원 이상은 만원 단위로 자른다
const remainText = (n: number): string => (n < 1e4 ? Math.round(n).toLocaleString('ko-KR') : floorMan(n))

// 매도 한도 박스(data-box="limit") — 사용 한도·한도(서버 값)·남은 한도·지금 공제율 구간·구간 마감
export function AccountLimitBox({ className, onApply, limit, onRetryLimit }: AccountLimitBoxProps) {
  const v = limitValues()

  return (
    <Box
      data-box="limit"
      className={className}
      title="매도 한도"
      actions={
        <button type="button" className={styles.link} onClick={onApply}>
          매도 신청 ›
        </button>
      }
    >
      <div className={styles.body}>
        {limit.status === 'live' && (
          <>
            <div className={styles.remainRow}>
              <span className={styles.remainLabel}>사용 한도</span>
              <b className={styles.remain}>{floorMan(limit.data.usedAmount)} 원</b>
              <span className={styles.of}>/ {floorMan(limit.data.limitAmount)}</span>
            </div>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: (limit.data.limitAmount > 0 ? (limit.data.usedAmount / limit.data.limitAmount) * 100 : 0) + '%' }} />
            </div>
            <div className={styles.row}>
              <span className={styles.key}>남은 한도</span>
              <span className={styles.val}>{remainText(Math.max(0, limit.data.remainingLimit))} 원</span>
            </div>
          </>
        )}
        {limit.status === 'loading' && <div className={styles.used}>사용 한도를 불러오고 있어요</div>}
        {limit.status === 'none' && <div className={styles.used}>한도 없음 · 계좌가 개설되면 확인할 수 있어요</div>}
        {limit.status === 'error' && (
          <div className={styles.used}>
            사용 한도를 불러오지 못했어요{' '}
            <button type="button" className={styles.guideLink} onClick={onRetryLimit}>다시 시도 ›</button>
          </div>
        )}
        <div className={styles.row}>
          <span className={styles.key}>지금 공제율 구간</span>
          <span className={styles.val}>{v.bandLabel}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>구간 마감</span>
          <span className={styles.val}>
            {v.bandEnd} (<span className={styles.dday}>D-{v.bandD}</span>)
          </span>
        </div>
      </div>
    </Box>
  )
}
