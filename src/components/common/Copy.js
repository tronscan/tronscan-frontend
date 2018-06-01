import {CopyToClipboard} from "react-copy-to-clipboard";
import React, {Fragment} from "react";
import {alpha} from "../../utils/str";
import {Tooltip} from "reactstrap";

export class CopyText extends React.Component {

  constructor() {
    super();

    this.state = {
      copied: false,
      id: alpha(24),
    };
  }

  setCopied = () => {
    this.setState({
      copied: true,
    });

    setTimeout(() => this.setState({ copied: false }), 1200);
  };

  render() {

    let {text, className} = this.props;
    let {copied, id} = this.state;

    return (
      <CopyToClipboard
        text={text}
        className={className}
        onCopy={this.setCopied}>
        <span id={id} style={{cursor: 'pointer'}}>
          <i className="fa fa-paste"/>
          <Tooltip placement="top" isOpen={copied} target={id}>
            Copied to clipboard
          </Tooltip>
        </span>
      </CopyToClipboard>
    )
  }
}
