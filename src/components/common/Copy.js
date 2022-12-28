import { CopyToClipboard } from "react-copy-to-clipboard";
import React, { Fragment } from "react";
import { alpha } from "../../utils/str";
import { Tooltip } from "reactstrap";
import { tu } from "../../utils/i18n";
import { message } from "antd";
import { injectIntl } from "react-intl";

class Copy extends React.Component {
  constructor() {
    super();

    this.state = {
      copied: false,
      id: alpha(24)
    };
  }

  setCopied = () => {
    let { intl } = this.props;

    this.setState({
      copied: true
    });
    message.success(intl.formatMessage({ id: "contract_copy_success" }), 2);

    setTimeout(() => this.setState({ copied: false }), 1200);
  };

  render() {
    let { text, className, intl } = this.props;
    let { copied, id } = this.state;

    return (
      <CopyToClipboard
        text={text}
        className={className}
        onCopy={this.setCopied}
      >
        <span id={id} style={{ cursor: "pointer" }}>
          <i className="fa fa-paste" />
          {/* <Tooltip placement="top" isOpen={copied} target={id}>
            {tu("copied_to_clipboard")}
          </Tooltip> */}
        </span>
      </CopyToClipboard>
    );
  }
}
const CopyText = injectIntl(Copy);

export { CopyText };
