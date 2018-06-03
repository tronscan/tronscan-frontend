import React from "react";
const jdenticon = require("jdenticon");

export default function Avatar({value, size = 100, ...props}) {

  let img = jdenticon.toSvg(value, size);

  return (
    <img src={"data:image/svg+xml," + img} {...props} alt="Avatar" />
  )
}
