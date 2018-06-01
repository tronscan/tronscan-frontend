import React from "react";
import GranimOverlay from "granim";

export default class Granim extends React.Component {

  constructor(props) {
    super(props);

    this.$ref = React.createRef();
  }

  componentDidMount() {

    let {options} = this.props;

    this.instance = new GranimOverlay({
      element: this.$ref.current,
      ...options,
    });
  }

  render() {
    let {options, ...props} = this.props;

    return (
      <canvas ref={this.$ref} {...props} />
    );
  }
}
