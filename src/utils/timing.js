import React from "react";


export function withTimers(WrapperComponent) {

  return class extends React.Component {
    constructor(props) {
      super(props);
      this.timeouts = [];
      this.intervals = [];
    }

    componentWillUnmount() {
      for (let timeout of this.timeouts) {
        clearTimeout(timeout);
      }

      for (let interval of this.intervals) {
        clearInterval(interval);
      }
    }

    setInterval = (func, interval) => {
      this.intervals.push(setInterval(func, interval));
    };

    setTimeout = (func, timeout) => {
      this.timeouts.push(setTimeout(func, timeout));
    };

    render() {
      return <WrapperComponent
          setInterval={this.setInterval}
          setTimeout={this.setTimeout}
          {...this.props} />;
    }
  };
}
