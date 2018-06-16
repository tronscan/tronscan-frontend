/* eslint-disable no-undef */
import React from "react";
import {connect} from "react-redux";
import {isNaN, random, range} from "lodash";
import {channel} from "../../services/api";
import {TRXPrice} from "../common/Price";
import {FormattedNumber} from "react-intl";
import {ONE_TRX} from "../../constants";
import {TronLoader} from "../common/loaders";
import {AddressLink, TokenLink} from "../common/Links";
import {tu} from "../../utils/i18n";

const MESSAGE_LIMIT = 30;


function Row({ key, icon, children, ...props }) {

  return (
    <div className="media text-muted my-1" key={key} {...props}>
      <i className={"fa fa-lg mx-2 fa-2x " + icon}/>
      <div className="media-body mb-0 lh-125 ">
        {children}
      </div>
    </div>
  );
}

class Live extends React.Component {

  constructor() {
    super();

    this.id = 0;

    this.state = {
      events: [],
      filters: {},
      filterButtons: [
        {
          label: tu("transactions"),
          icon: 'fa fa-exchange-alt',
          id: 'transaction',
        },
        {
          label: tu("votes"),
          icon: 'fa fa-bullhorn',
          id: 'vote',
        },
        {
          label: tu("asset_participation"),
          icon: 'fa fa-arrow-right',
          id: 'asset-participate',
        },
        {
          label: tu("token_created"),
          icon: 'fa fa-plus-circle',
          id: 'asset-create',
        },
        {
          label: tu("witness"),
          icon: 'fa fa-eye',
          id: 'witness-create',
        },
        {
          label: tu("account"),
          icon: 'fa fa-user',
          id: 'account-name-changed',
        },
      ]
    };

    for (let button of this.state.filterButtons) {
      this.state.filters[button.id] = true;
    }
  }

  componentDidMount() {
    this.listen();
  }

  componentWillUnmount() {
    this.listener.close();
  }

  listen = () => {
    this.listener = channel("/blockchain");
    this.listener.on("transfer", trx => {
      this.addEvent({
        type: "transfer",
        ...trx,
      });
    });
    this.listener.on("vote", event => {
      this.addEvent({
        type: "vote",
        ...event,
      });
    });
    this.listener.on("asset-participate", event => {
      this.addEvent({
        type: "asset-participate",
        ...event,
      });
    });
    this.listener.on("witness-create", event => {
      this.addEvent({
        type: "witness-create",
        ...event,
      });
    });

    this.listener.on("asset-create", event => {
      this.addEvent({
        type: "asset-create",
        ...event,
      });
    });
  };

  addEvent = (event) => {

    event.id = this.id++;

    if (this.state.filters[event.type] === true) {
      this.setState((prevState, props) => ({
        events: [event, ...prevState.events.slice(0, MESSAGE_LIMIT)]
      }));
    }

  };

  buildRow(event, index) {

    switch(event.type) {
      case "transfer":
        return (
          <Row key={event.id} icon="fa-exchange-alt">
            <AddressLink address={event.transferFromAddress} truncate={false} />{' '}
            <i className="fa fa-arrow-right"/>{' '}
            <AddressLink address={event.transferToAddress} truncate={false} /><br/>
            <FormattedNumber value={event.amount / ONE_TRX}/> {event.tokenName}
          </Row>
        );

      case "vote":
        return (
          <Row key={event.id} icon="fa-bullhorn">
            <AddressLink address={event.voterAddress} truncate={false} />{' '}
            gave {' '}
            <b><FormattedNumber value={event.votes}/></b>{' '}
            to {' '}
            <AddressLink address={event.candidateAddress} truncate={false} />
          </Row>
        );

      case "asset-participate":
        return (
          <Row key={event.id} icon="fa-arrow-right">
            <AddressLink address={event.ownerAddress} truncate={false} /> bought {event.amount} {event.tokenName}
          </Row>
        );

      case "asset-create":
        return (
          <Row key={event.id} icon="fa-plus-circle">
            <AddressLink address={event.ownerAddress} truncate={false} /> created token <TokenLink name={event.name} />
          </Row>
        );

      case "witness-create":
        return (
          <Row key={event.id} icon="fa-user">
            <AddressLink address={event.address} truncate={false} /> applied for Super Representative
          </Row>
        );
    }

    return (
      <div className="media text-muted pt-3" key={'other-' + index}>
        <p className="media-body pb-3 mb-0 small lh-125 ">
          Unknown
        </p>
      </div>
    )
  }

  setFilter(name, value) {
    let {filters} = this.state;

    this.setState({
      filters: {
        ...filters,
        [name]: value,
      },
    })
  }

  render() {

    let {events, filters, filterButtons} = this.state;

    return (
      <main className="container header-overlap page-live pb-3">
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">
                  Filters
                </h5>
                <form className="pt-2">
                  {
                    filterButtons.map(filterButton => (<label className="form-check">
                        <input className="form-check-input"
                               type="checkbox"
                               checked={filters[filterButton.id]}
                               onChange={(ev) => this.setFilter(filterButton.id, ev.target.checked)}/>
                        <a className="form-check-label d-flex flex-row">
                          {filterButton.label}
                          <i className={filterButton.icon + " ml-auto"}/>
                        </a>
                      </label>
                    ))
                  }
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-9 mt-3 mt-md-0">
            {
              events.length === 0 ?
                <div className="card">
                  <TronLoader>
                    {tu("waiting_for_transactions")}
                  </TronLoader>
                </div> :
                <div className="card">
                  <ul className="list-group list-group-flush">
                    {
                      events.map(row => (
                        <li className="list-group-item p-1">
                          {this.buildRow(row)}
                        </li>
                      ))
                    }
                  </ul>
                </div>
            }
          </div>
        </div>
      </main>
    )
  }
}





function mapStateToProps(state) {

  return {
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Live);
