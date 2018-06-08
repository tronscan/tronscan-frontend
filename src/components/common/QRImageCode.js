import React from "react";
import QRCode from 'qrcode';

export default class QRImageCode extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      img: null
    };
  }

  componentDidMount() {

    let {value, size = 120} = this.props;

    QRCode.toDataURL(value, {
      width: size,
    }).then(img => {
      this.setState({ img });
    })
  }

  render() {

    let {...props} = this.props;

    if (!this.state.img) {
      return null;
    }

    return (
      <img src={this.state.img} {...props} />
    );
  }
}
