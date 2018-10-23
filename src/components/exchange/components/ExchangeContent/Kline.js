import React from "react";

export function Kline() {

  return (
    <div className="exchange__kline p-3 mb-2">
    {/* title 信息 */}
    <div className="d-flex exchange__kline__title">
      <h5 className="mr-3">IGG/MEETONE ≈ <span>0.00245</span></h5>
      <div className="mr-3">涨幅<span className="ex-red ml-2">-6.65%</span></div>
      <div className="mr-3">高<span className=" ml-2">0.00245</span></div>
      <div className="mr-3">低<span className=" ml-2">0.00245</span></div>
      <div className="mr-3">24H成交量<span className=" ml-2">22332.23</span></div>
    </div>

    <hr/>

    <div className="exchange__kline__pic"></div>

  </div>
  )
}
