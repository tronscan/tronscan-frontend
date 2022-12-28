import React from "react";
import {Client} from "../../services/api";

export default class AccountName extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      name: null,
      isLoading: false,
    };
  }

  async loadName() {

    let {address} = this.props;

    this.setState({ isLoading: true });
    let account = await Client.getAccountByAddress(address);

    this.setState({
      name: account.name,
      isLoading: false,
    });
  }

  componentDidMount() {
    this.loadName();
  }

  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address) {
      this.loadName();
    }
  }

  render() {
    let {children, loading} = this.props;
    let {name, isLoading} = this.state;

    if (isLoading && loading) {
      return loading();
    }

    if (!name) {
      return null;
    }

    if (!children) {
      return name;
    }

    return children(name);
  }
}
