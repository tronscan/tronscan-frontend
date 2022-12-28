import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { Popover, Button } from "antd";

class HotFire extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {}
  render() {
    let content = "123";
    return (
      <div className="">
        <Popover content={content} title="Title">
          <Button type="primary">Hover me</Button>
        </Popover>
      </div>
    );
  }
}

export default injectIntl(HotFire);
