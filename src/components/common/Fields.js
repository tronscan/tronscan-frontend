import React from "react";
import {round} from "lodash";

export class NumberField extends React.Component {

  onChange = (ev) => {
    let {onChange, decimals = 6, min = null, max = null} = this.props;

    if (onChange) {
      let number = ev.target.value;
      number = parseFloat(number);
      if (isNaN(number)) {
        number = '';
      } else {
        number = round(number, decimals);
        if (min !== null) {
          number = number > min ? number : min;
        }
        if (max !== null) {
          number = number > max ? max : number;
        }
      }
      onChange(number);
    }

  };

  onKeyDownCheck = (event) => {
    if (String.fromCharCode(event.which)==='E') {
      event.preventDefault();
      return false;
    }
  };

  render() {

    let {onChange, ...props} = this.props;

    return (
      <input type="text" onKeyDown={this.onKeyDownCheck} onChange={this.onChange} {...props} />
    )
  }

}
