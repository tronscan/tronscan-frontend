import React from "react";
import Instascan from "instascan";
import {Alert} from "reactstrap";

export default class Scanner extends React.Component {

  constructor() {
    super();

    this.state = {
      error: null,
    };

    this.ref = React.createRef();
  }


  componentDidMount() {

    let {onScan} = this.props;

    this.scanner = new Instascan.Scanner({
      video: this.ref.current,
      backgroundScan: false,
    });
    this.scanner.addListener('scan', function (content) {
      onScan({
        code: content,
      });
    });

    this.initCameras();
  }

  componentWillUnmount() {
    this.scanner.stop();
  }

  initCameras = async () => {

    try {
      let cameras = await Instascan.Camera.getCameras();
      if (cameras.length > 0) {
        await this.scanner.start(cameras[0]);
      } else {
        this.setState({
          error: (
            <Alert color="warning" className="text-center">
              No webcam found
            </Alert>
          )
        });
      }
    } catch (e) {
      this.setState({
        error: (
          <Alert color="danger" className="text-center">
            Error while trying to enable webcam. <br/>Make sure camera permissions are enabled.
          </Alert>
        )
      })
    }
  };

  render() {

    let {error} = this.state;

    if (error) {
      return error;
    }

    return (
      <video className="w-100" style={styles.video} ref={this.ref}/>
    )
  }
}

const styles = {
  video: {
    // height: 500,
  },
};
