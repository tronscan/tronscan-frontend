import QRCode from 'qrcode'

export function GenerateQRCode(value, size = 260) {

  // var bgImage = new Image();
  // bgImage.src = tronLogo;
  //
  // bgImage.onload = () => {
  //
  //   new AwesomeQR().create({
  //     text: value,
  //     size,
  //     // logoImage: bgImage,
  //     backgroundImage: bgImage,
  //     margin: 0,
  //     autoColor: true,
  //     callback: (data) => {
  //       this.setState({
  //         img: data
  //       });
  //     }
  //   });
  // };


  return QRCode.toDataURL(value, {
    width: size,
  });
  //
  // return new Promise(resolve => {
  //   new AwesomeQR().create({
  //     text: value,
  //     size,
  //     // logoImage: bgImage,
  //     // backgroundImage: bgImage,
  //     margin: 0,
  //     autoColor: true,
  //     callback: resolve,
  //   });
  // })
}
