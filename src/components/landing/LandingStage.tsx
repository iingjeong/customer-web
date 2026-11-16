import { LandingAmount } from './LandingAmount'
import { LandingClosingPhoto, LandingDawn, LandingNight, LandingPhoto } from './LandingBackdrops'
import { LandingClosing } from './LandingClosing'
import type { LandingDates } from './landingDates'
import { LandingFaq } from './LandingFaq'
import { LandingGlobe } from './LandingGlobe'
import { LandingHeading } from './LandingHeading'
import { LandingHero } from './LandingHero'
import { LandingLaptop } from './LandingLaptop'
import type { Reg } from './landingRefs'
import { LandingServices } from './LandingServices'
import { LandingTax } from './LandingTax'
import { LandingDate, LandingFx, LandingGch } from './LandingYear'

// 고정된 화면(#pin) 안의 1920×1080 무대(#stage). 겹치는 순서가 연출에 중요해서 원본 index.html의 순서를 그대로 지킨다
export function LandingStage({ reg, dates, loggedIn }: { reg: Reg; dates: LandingDates; loggedIn: boolean }) {
  return (
    <div id="pin" ref={reg('pin')}>
      <div id="stage" ref={reg('stage')}>
        <LandingDawn reg={reg} />
        <LandingNight reg={reg} />
        <LandingGlobe reg={reg} />
        <LandingLaptop reg={reg} />
        <LandingPhoto reg={reg} />
        <LandingHero reg={reg} dates={dates} />

        <LandingHeading reg={reg} k="hO" en="01 · Open" lines={['매도 한도부터 정해요']} />
        <LandingHeading reg={reg} k="hD" en="02 · Deposit" lines={['세 수량 중 가장 작은 만큼 들어와요']} />
        <LandingHeading reg={reg} k="h1" en="03 · Sell" lines={['RIA 계좌에서 해외주식을 팔면']} />
        <LandingHeading reg={reg} k="h2" en="04 · Exchange" lines={['달러로 팔았는데, 원화로 들어와요']} light />
        <LandingFx reg={reg} />
        <LandingHeading reg={reg} k="h3" en="05 · Homecoming" lines={['그대로, 국내로 돌아와요']} p="출발 NEW YORK · TOKYO → 도착 SEOUL" light />
        <LandingHeading reg={reg} k="h4" en="06 · One year" lines={['1년만 두면, 혜택은 그대로예요']} />
        <LandingDate reg={reg} />

        <LandingGch reg={reg} />

        <LandingHeading reg={reg} k="hT" en="07 · Tax" lines={['일찍 팔수록, 더 아껴요']} />
        <LandingTax reg={reg} todayRate={dates.rate} />

        <LandingHeading reg={reg} k="hV" en="08 · Service" lines={['RIA의 모든 단계를', '리턴증권이 함께해요']} />
        <LandingServices reg={reg} />

        <LandingHeading reg={reg} k="hF" en="09 · FAQ" lines={['자주 묻는 질문']} />
        <LandingFaq reg={reg} />

        <LandingClosingPhoto reg={reg} />
        <LandingClosing reg={reg} mySave={dates.mySave} withdraw={dates.withdraw} loggedIn={loggedIn} />

        <LandingAmount reg={reg} />
      </div>
    </div>
  )
}
