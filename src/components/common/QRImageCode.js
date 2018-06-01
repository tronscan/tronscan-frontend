import React from "react";
import AwesomeQR from 'awesome-qr/dist/awesome-qr';
const tronLogo = require('../../images/tron-logo.jpg');

export default class QRImageCode extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      img: null
    };
  }

  componentDidMount() {

    let {value, size = 120} = this.props;

    var bgImage = new Image();
    bgImage.src = tronLogo;

    bgImage.onload = () => {

      new AwesomeQR().create({
        text: value,
        size,
        // logoImage: bgImage,
        backgroundImage: bgImage,
        margin: 0,
        autoColor: true,
        callback: (data) => {
          this.setState({
            img: data
          });
        }
      });
    };

  }

  render() {

    let {...props} = this.props;

    if (!this.state.img) {
      return null;
    }

    return (
      <img src={this.state.img} {...props} />
    )

  }
}
