import React from "react";
import Instascan from "instascan-v2";
import { Alert } from "reactstrap";
import { tu } from "../../../utils/i18n";

export default class Scanner extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null
    };

    this.ref = React.createRef();
  }

  componentDidMount() {
    let { onScan } = this.props;

    this.scanner = new Instascan.Scanner({
      video: this.ref.current,
      backgroundScan: false
    });
    this.scanner.addListener("scan", function(content) {
      onScan({
        code: content
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
              {tu("no_webcam_found")}
            </Alert>
          )
        });
      }
    } catch (e) {
      this.setState({
        error: (
          <Alert color="danger" className="text-center">
            {tu("trying_enable_webcam_message_0")} <br />
            {tu("trying_enable_webcam_message_1")}
          </Alert>
        )
      });
    }
  };

  render() {
    let { error } = this.state;

    if (error) {
      return error;
    }

    return <video className="w-100" style={styles.video} ref={this.ref} />;
  }
}

const styles = {
  video: {
    // height: 500,
  }
};
