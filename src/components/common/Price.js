import React, {Fragment} from "react";
import xhr from "axios/index";
import {FormattedNumber} from "react-intl";
import {Tooltip} from "reactstrap";
import {alpha} from "../../utils/str";
import {connect} from "react-redux";
import {ONE_TRX} from "../../constants";
let PriceContext = React.createContext({
  priceBTC: 0,
  priceUSD: 0,
});

let {Provider, Consumer} = PriceContext;

class PriceProviderCmp extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      prices: {
        BTC: 0,
        EUR: 0,
        USD: 0,
        TRX: 1,
      },
      priceShown: props.activeCurrency || 'TRX',
      currencies: {},
      activePrice: 1,
    };

    for (let currency of props.currencies) {
      this.state.currencies[currency.id.toUpperCase()] = currency;
    }
  }

  componentWillReceiveProps(nextProps) {

    this.setState((state) => ({
      priceShown: nextProps.activeCurrency,
      activePrice: state.prices[nextProps.activeCurrency.toUpperCase()],
    }));
  }

  async loadPrices() {

    let {data} = await xhr.get(`https://api.coinmarketcap.com/v1/ticker/tronix/?convert=EUR`);
    let {data: dataEth} = await xhr.get(`https://api.coinmarketcap.com/v1/ticker/tronix/?convert=ETH`);

    let newPrices = {
      BTC: parseFloat(data[0].price_btc),
      EUR: parseFloat(data[0].price_eur),
      USD: parseFloat(data[0].price_usd),
      ETH: parseFloat(dataEth[0].price_eth),
      TRX: 1,
    };

    this.setState((state) => ({
      prices: newPrices,
      activePrice: newPrices[state.priceShown.toUpperCase()],
    }));
  }

  componentDidMount() {
    this.loadPrices();
  }

  render() {
    let {children} = this.props;

    return (
      <Provider value={this.state}>
        {children}
      </Provider>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeCurrency: state.app.activeCurrency,
    currencies: state.app.currencyConversions,
  };
}

const mapDispatchToProps = {
};

export let PriceProvider = connect(mapStateToProps, mapDispatchToProps)(PriceProviderCmp);

export class TRXPrice extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      open: false,
      id: alpha(24),
    };
  }

  renderPrice(value, priceValues) {
    let {currency = ""} = this.props;
    let id = currency || priceValues.priceShown;
    return priceValues.prices[id.toUpperCase()] * value;
  }

  render() {
    let {open, id} = this.state;
    let {source,name,amount = 0, currency = "", showCurreny = true, showPopup = true, ...props} = this.props;
      let ele = null;
    return (
      <Consumer>
          {
              priceValues => {
                  switch (source) {
                      case 'transfers':
                          ele = <Fragment>
                            <FormattedNumber
                                value={this.renderPrice(amount, priceValues)}
                                maximumFractionDigits={12}>
                                {value => <span id={id}
                                                onMouseEnter={() => this.setState({open: true})}
                                                onMouseLeave={() => this.setState({open: false})}
                                                {...props}>
                              {name == 'TRX' ? amount / ONE_TRX : amount} {name}
                                        </span>}
                            </FormattedNumber>
                              {
                                  showPopup && <Tooltip placement="top" isOpen={open} target={id}>
                                    TRX <FormattedNumber value={amount / ONE_TRX} maximumFractionDigits={6}
                                                         minimumFractionDigits={6}/> <br/>
                                    BTC <FormattedNumber value={priceValues.prices.BTC * (amount / ONE_TRX)}
                                                         maximumFractionDigits={priceValues.currencies.BTC.fractions || 2}/>
                                    <br/>
                                    ETH <FormattedNumber value={priceValues.prices.ETH * (amount / ONE_TRX)}
                                                         maximumFractionDigits={priceValues.currencies.ETH.fractions || 2}/><br/>
                                    USD <FormattedNumber value={priceValues.prices.USD * (amount / ONE_TRX)}
                                                         maximumFractionDigits={priceValues.currencies.USD.fractions || 2}/><br/>
                                    EUR <FormattedNumber value={priceValues.prices.EUR * (amount / ONE_TRX)}
                                                         maximumFractionDigits={priceValues.currencies.EUR.fractions || 2}/>
                                  </Tooltip>
                              }
                          </Fragment>
                          break;
                      case 'home':
                          ele = <Fragment>
                            <FormattedNumber
                                value={this.renderPrice(amount, priceValues)}
                                maximumFractionDigits={priceValues.currencies[currency.toUpperCase() || priceValues.priceShown.toUpperCase()].fractions || 2}>
                                {value => <span id={id}
                                                onMouseOver={() => this.setState({open: true})}
                                                onMouseOut={() => this.setState({open: false})}
                                                {...props}>
          {value} {showCurreny && (currency.toUpperCase() || priceValues.priceShown.toUpperCase())}
          </span>}
                            </FormattedNumber>
                              {
                                  showPopup && <Tooltip placement="top" isOpen={open} target={id}>
                                    TRX <FormattedNumber value={amount} maximumFractionDigits={6}
                                                         minimumFractionDigits={6}/> <br/>
                                    <span className="text-capitalize">satoshi</span> <FormattedNumber value={priceValues.prices.BTC * amount * Math.pow(10, 8)}
                                                             maximumFractionDigits={priceValues.currencies.BTC.fractions || 2}/>
                                    <br/>
                                    ETH <FormattedNumber value={priceValues.prices.ETH * amount}
                                                         maximumFractionDigits={priceValues.currencies.ETH.fractions || 2}/><br/>
                                    USD <FormattedNumber value={priceValues.prices.USD * amount}
                                                         maximumFractionDigits={priceValues.currencies.USD.fractions || 6}/><br/>
                                    EUR <FormattedNumber value={priceValues.prices.EUR * amount}
                                                         maximumFractionDigits={priceValues.currencies.EUR.fractions || 6}/>
                                  </Tooltip>
                              }
                          </Fragment>
                          break;
                      default:
                          ele = <Fragment>
                            <FormattedNumber
                                value={this.renderPrice(amount, priceValues)}
                                maximumFractionDigits={priceValues.currencies[currency.toUpperCase() || priceValues.priceShown.toUpperCase()].fractions || 2}>
                                {value => <span id={id}
                                                onMouseEnter={() => this.setState({open: true})}
                                                onMouseLeave={() => this.setState({open: false})}
                                                {...props}>
          {value} {showCurreny && (currency.toUpperCase() || priceValues.priceShown.toUpperCase())}
          </span>}
                            </FormattedNumber>
                              {
                                  showPopup && <Tooltip placement="top" isOpen={open} target={id}>
                                    TRX <FormattedNumber value={amount} maximumFractionDigits={6}
                                                         minimumFractionDigits={6}/> <br/>
                                    BTC <FormattedNumber value={priceValues.prices.BTC * amount}
                                                         maximumFractionDigits={priceValues.currencies.BTC.fractions || 2}/>
                                    <br/>
                                    ETH <FormattedNumber value={priceValues.prices.ETH * amount}
                                                         maximumFractionDigits={priceValues.currencies.ETH.fractions || 2}/><br/>
                                    USD <FormattedNumber value={priceValues.prices.USD * amount}
                                                         maximumFractionDigits={priceValues.currencies.USD.fractions || 2}/><br/>
                                    EUR <FormattedNumber value={priceValues.prices.EUR * amount}
                                                         maximumFractionDigits={priceValues.currencies.EUR.fractions || 2}/>
                                  </Tooltip>
                              }
                          </Fragment>
                  }
                  return ele
              }
          }


      </Consumer>
    )
  }
}
