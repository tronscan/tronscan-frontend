import React from "react";
import * as Spinners from "react-spinners";
import TronIcon from "../../images/tron-icon-animated.svg";

const DEFAULT_COLOR = "#343a40";

export function BarLoader(props = {}) {
  return (
    <Spinners.BarLoader color={DEFAULT_COLOR} loading={true} height={5} width={150} {...props} />
  )
}

export function PropagateLoader(props = {}) {
  return (
    <Spinners.PropagateLoader color={DEFAULT_COLOR} size={20} {...props} />
  )
}

export function TronLoader({options = {}, children = null, height = 70, ...props}) {

  return (
    <div className="p-3 text-center">
      <img src={TronIcon} style={{ height }} />
      {
        children && <div className="pt-3">
          {children}
        </div>
      }

    </div>
  );
}
