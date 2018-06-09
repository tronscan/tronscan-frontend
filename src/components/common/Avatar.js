import React from "react";
import jdenticon from "jdenticon";

export default function Avatar({value, size = 100, ...props}) {

  let img = jdenticon.toSvg(value, size).toString().replace(/#/g, '%23');

  return (
    <img src={"data:image/svg+xml," + img} {...props} alt="Avatar" />
  )
}
