import React from "react";
import Transport from "@ledgerhq/hw-transport-u2f";
import AppTrx from '@ledgerhq/hw-app-trx';

export class LedgerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '',
    };
    this.path = "44'/195'/0'/0/0";
  }

  componentDidMount() {
  }

  testConnection = async () => {

    console.log("waiting...");
    const address = await this.getAddress();
    console.log("CONNECTED!", address);

    this.setState({ address });
  };

  async getAddress() {
    return new Promise(async (resolve, reject) => {
      const transport = await Transport.create();
      try {
        const trx = new AppTrx(transport);
        let address = await trx.getAddress(this.path);
        resolve(address.address);
      } catch(e) {
        reject(e);
      } finally {
        transport.close();
      }
    });
  }

  async listenForConnection() {
    return new Promise(resolve => {
      const sub = Transport.listen({
        next: async e => {
          console.log("event", e);
          if (e.type === "add") {
            sub.unsubscribe();
            resolve(e);
          }
        },
        error: error => {
          console.log("GOT ERROR", error);
        },
        complete: () => {
          console.log("DONE");
        }
      });
    });
  }


  render() {


    const {address} = this.state;

    return (
      <div className="test">
        <button onClick={this.testConnection}>Test</button>
        <span>{address}</span>
      </div>
    )
  }
}
