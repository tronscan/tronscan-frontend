import React from "react";

export function TextField({ cmp, field, className = "form-control", type = "text", ...props }) {

  let [objName, fieldName] = field.split(".");

  let value = null;

  let onChange = (ev) => {
  };

  if (typeof fieldName === 'undefined') {
    value = cmp.state[objName];
    onChange = (ev) => {

      cmp.setState({
        [objName]: type !== "checkbox" ? ev.target.value : ev.target.checked,
      });
    }
  } else {
    value = cmp.state[objName][fieldName];
    onChange = (ev) => {
      cmp.setState({
        [objName]: {
          ...cmp.state[objName],
          [fieldName]: type !== "checkbox" ? ev.target.value : ev.target.checked,
        }
      });
    }
  }

  return (
    <input
      type={type}
      className={className}
      onChange={onChange}
      value={value}
      {...props} />
  )
}
