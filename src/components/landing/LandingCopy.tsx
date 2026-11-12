export function LandingCopy() {
  return (
    <>
      {/* S3 도입(토스의 D 전환): 아래 #c3와 같은 문장이 두 덩어리로 갈라지고, 그 사이에서 검은 둥근 막대가 커져 화면을 덮는다(엔진 s3Frame).
          같은 문장을 두 번 읽지 않게 화면 낭독기에는 숨긴다 */}
      <div id="s3d" aria-hidden="true">
        <i id="s3bar" />
        <p className="s3d-l"><span className="bw">RIA</span> <span className="bw">계좌에서</span> <span className="bw">매도하면,</span></p>
        <p className="s3d-r"><span className="bw">대금은</span> <span className="bw">원화로</span> <span className="bw">자동</span> <span className="bw">환전돼요</span></p>
      </div>
      <div className="blk" id="c3">
        <div className="row">
          <div className="h">
            <span className="ml">
              <span>RIA 계좌에서 매도하면, 대금은 원화로 자동 환전돼요</span>
            </span>
          </div>
        </div>
      </div>
      <div className="blk" id="c4">
        <i id="c4lab" hidden />
        <div className="stack">
          <div className="h" id="c4a">
            <span className="ml">
              <span>해외에 있던 자산이,</span>
            </span>
            <span className="ml">
              <span>국내로 돌아옵니다.</span>
            </span>
          </div>
        </div>
      </div>
      <i id="slogan" hidden />
    </>
  )
}
