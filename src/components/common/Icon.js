import React from "react";


export function WidgetIcon({className, ...props}) {
  return (
    <span className="icon-big" {...props}>
      <i className={" fa-10x " + className} />
    </span>
  )
}
