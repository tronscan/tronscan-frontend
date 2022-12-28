/* eslint-disable no-undef */
import React from "react";
import {connect} from "react-redux";
import {channel} from "../../services/api";
import {FormattedNumber} from "react-intl";
import {ONE_TRX} from "../../constants";
import {TronLoader} from "../common/loaders";
import {AddressLink, TokenLink} from "../common/Links";
import {tu, t} from "../../utils/i18n";
import {Checkbox, Row, Col} from 'antd';

const MESSAGE_LIMIT = 30;

function Trxrow({valdata, icon, children, ...props}) {

  return (
      <li className="list-group-item p-1">
        <div className="media my-3 mx-3" key={valdata} {...props}>
          {/* <i className={"fa fa-lg mx-2 fa-2x " + icon}/> */}
          <div className="media-body mb-0 lh-125 ">
            {children}
          </div>
        </div>
      </li>
  );
}

class Live extends React.Component {

  constructor() {
    super();

    this.id = 0;

    this.state = {
      events: [],
      filters: [],
      filterButtons: [
        {
          label: tu("transactions"),
          icon: 'fa fa-exchange-alt',
          value: 'transfer',
        },
        {
          label: tu("votes"),
          icon: 'fa fa-bullhorn',
          value: 'vote',
        },
        {
          label: tu("asset_participation"),
          icon: 'fa fa-arrow-right',
          value: 'asset-participate',
        },
        {
          label: tu("token_created"),
          icon: 'fa fa-plus-circle',
          value: 'asset-create',
        },
        {
          label: tu("witness"),
          icon: 'fa fa-eye',
          value: 'witness-create',
        },
        {
          label: tu("account"),
          icon: 'fa fa-user',
          value: 'account-name-changed',
        },
      ]
    };

    for (let button of this.state.filterButtons) {
      this.state.filters.push(button.value)
    }
  }

  componentDidMount() {
    this.listen();
  }

  componentWillUnmount() {
    this.listener.close();
  }

  listen = () => {
    // this.listener = channel("/blockchain");
    // this.listener.on("transfer", trx => {
    //   this.addEvent({
    //     type: "transfer",
    //     ...trx,
    //   });
    // });
    // this.listener.on("vote", event => {
    //   this.addEvent({
    //     type: "vote",
    //     ...event,
    //   });
    // });
    // this.listener.on("asset-participate", event => {
    //   this.addEvent({
    //     type: "asset-participate",
    //     ...event,
    //   });
    // });
    // this.listener.on("witness-create", event => {
    //   this.addEvent({
    //     type: "witness-create",
    //     ...event,
    //   });
    // });

    // this.listener.on("asset-create", event => {
    //   this.addEvent({
    //     type: "asset-create",
    //     ...event,
    //   });
    // });
  };

  addEvent = (event) => {

    event.id = this.id++;

    if (this.state.filters.indexOf(event.type) > -1) {
      this.setState((prevState, props) => ({
        events: [event, ...prevState.events.slice(0, MESSAGE_LIMIT)]
      }));
    }

  };

  buildRow(event, index) {

    switch (event.type) {
      case "transfer":
        return (
            <Trxrow key={event.id} icon="fa-exchange-alt">
              <div className="row">
                <div className="col-xs-10 col-sm-5">
                  <h5 className="card-title text-left">
                    <b>{tu("token_transfer")}</b>
                  </h5>
                  {tu("from")}{': '}
                  <span className="position-absolute ml-2"><AddressLink address={event.transferFromAddress}
                                                                        truncate={true}/></span>
                </div>

                <div className="col-xs-4 col-sm-2 d-flex justify-content-center align-items-center">
                 <img src={require("../../images/arrow.png")}/>
                </div>

                <div className="col-xs-10 col-sm-5">
                  <div>{tu("asset")}{': '}
                    {
                      event.tokenName === 'TRX' ?
                          <b><FormattedNumber
                              maximumFractionDigits={7}
                              minimunFractionDigits={7}
                              value={event.amount / ONE_TRX}/></b> :
                          <b><FormattedNumber
                              maximumFractionDigits={7}
                              minimunFractionDigits={7}
                              value={event.amount}/></b>
                    }
                    {' '}{event.tokenName}
                  </div>
                  <div>
                    {tu("to")}{': '}
                    <span className="position-absolute ml-2"><AddressLink address={event.transferToAddress}
                                                                          truncate={true}/></span>
                  </div>
                </div>
              </div>
            </Trxrow>
        );

      case "vote":
        return (

            <Trxrow key={event.id} icon="fa-bullhorn">
              <div className="row">
                <div className="col-xs-8 col-sm-5">
                  <h5 className="card-title text-left">
                    <b>{tu("voting")}</b>
                  </h5>
                </div>
                <div className="col-xs-8 col-sm-2">

                </div>
                <div className="col-xs-8 col-sm-5">
                  {tu("votes")}{': '}<b><FormattedNumber value={event.votes}/></b>
                </div>
                <div className="col-xs-8 col-sm-5">
                  {tu("voter")}{': '}
                  <span className="position-absolute ml-2"><AddressLink address={event.voterAddress} truncate={false}/></span>
                </div>
                <div className="col-xs-8 col-sm-2">

                </div>
                <div className="col-xs-8 col-sm-5">
                  {tu("representatives")}{': '}
                  <span className="position-absolute ml-2"><AddressLink address={event.candidateAddress}
                                                                        truncate={false}/></span>
                </div>
              </div>
            </Trxrow>
        );

      case "asset-participate":
        return (

            <Trxrow key={event.id} icon="fa-arrow-right">
              <div className="row">
                <div className="col-xs-8 col-sm-5">
                  <h5 className="card-title text-left">
                    <b>{tu("asset_participation")}</b>
                  </h5>
                </div>
                <div className="col-xs-8 col-sm-2">

                </div>
                <div className="col-xs-8 col-sm-5">
                  {tu("token_name")}{': '}<b>{event.name}</b>
                </div>
                <div className="col-xs-8 col-sm-5">
                  {tu("owner_address")}{': '}
                  <span className="position-absolute ml-2"><AddressLink address={event.ownerAddress} truncate={false}/></span>
                </div>
                <div className="col-xs-8 col-sm-2">

                </div>
                <div className="col-xs-8 col-sm-5">
                  {tu("bought")}{': '}{event.amount} {event.name}
                </div>
              </div>
            </Trxrow>
        );

      case "asset-create":
        return (
            <Trxrow key={event.id} icon="fa-plus-circle">
              <div className="row">
                <div className="col-xs-8 col-sm-5">
                  <h5 className="card-title text-left">
                    <b>{tu("token_creation")}</b>
                  </h5>
                </div>
                <div className="col-xs-8 col-sm-2">

                </div>
                <div className="col-xs-8 col-sm-5">
                  {tu("token_name")}{': '}<b><TokenLink name={event.name}/></b>
                </div>
                <div className="col-sm-9">
                  {tu("address")}{': '}<AddressLink address={event.ownerAddress}
                                                    truncate={false}/>{' '}{t("created_token")}{' '}<TokenLink
                    name={event.name}/>
                </div>
              </div>
            </Trxrow>
        );

      case "witness-create":
        return (
            <Trxrow key={event.id} icon="fa-user">
              <div className="row">
                <div className="col-xs-8 col-sm-5">
                  <h5 className="card-title text-left">
                    <b>{tu("sr_candidature")}</b>
                  </h5>
                </div>
                <div className="col-xs-8 col-sm-2">

                </div>
                <div className="col-xs-8 col-sm-5">
                  {tu("address")}{': '}
                  <AddressLink address={event.ownerAddress}
                               truncate={false}/>{' '}{t("applied_for_super_representative")}
                </div>
              </div>
            </Trxrow>
        );
    }

    return (
        <div className="media pt-3" key={'other-' + index}>
          <p className="media-body pb-3 mb-0 small lh-125 ">
            Unknown
          </p>
        </div>
    )
  }

  setFilter(value) {
    this.setState({filters: value})
  }

  render() {

    let {events, filters, filterButtons} = this.state;

    return (
        <main className="container header-overlap page-live pb-3 token_black live">
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {tu("filters")}
                  </h5>
                  <form className="pt-2">
                    {<Checkbox.Group style={{width: '100%'}} onChange={this.setFilter.bind(this)}
                                     defaultValue={filters}>
                      <Row className="d-flex">{
                        filterButtons.map(filterButton => (
                            <Col className="mr-5" key={filterButton.value} >
                              <i className={filterButton.icon + " ml-2"}/>
                              <span className="ml-1 mr-1">{filterButton.label}</span>
                              <Checkbox value={filterButton.value}></Checkbox>
                            </Col>
                        ))
                      }</Row>
                    </Checkbox.Group>}
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-3 mt-md-0">
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
                              this.buildRow(row)
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
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Live);
