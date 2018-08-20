import React from "react";

export function Truncate({children}) {
  return (
      <div className="truncate-ellipsis">
          <span>{children}</span>
      </div>
  )
}
