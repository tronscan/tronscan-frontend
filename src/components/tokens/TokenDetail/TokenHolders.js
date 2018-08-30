import React from "react";
import {tu} from "../../../utils/i18n";
import {AddressLink} from "../../common/Links";
import {Client} from "../../../services/api";
import {ONE_TRX} from "../../../constants";
import SmartTable from "../../common/SmartTable.js"
import {FormattedNumber, injectIntl} from "react-intl";


class TokenHolders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      addresses: [],
      page: 0,
      total: 0,
      pageSize: 25,
    };
  }

  componentDidMount() {
    this.loadTokenHolders();
  }

  componentDidUpdate() {

  }

  onChange = (page, pageSize) => {
    this.loadTokenHolders(page, pageSize);
  };

  loadTokenHolders = async (page = 1, pageSize = 40) => {
    let {filter} = this.props;
    this.setState({loading: true});

    let {addresses, total} = await Client.getTokenHolders(filter.token, {
      sort: '-balance',
      limit: pageSize,
      start: (page - 1) * pageSize,
      count: true
    });

    for (let index in addresses) {
      addresses[index].index = parseInt(index) + 1;
    }

    this.setState({
      page,
      addresses,
      total,
      loading: false,
    });

  };
  customizedColumn = () => {
    let {intl,token} = this.props;
    let column = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        width: '10%',
        align: 'left',
        className: 'ant_table',
      },
      {
        title: intl.formatMessage({id: 'address'}),
        dataIndex: 'address',
        key: 'address',
        render: (text, record, index) => {
          return <AddressLink address={record.address}/>
        }
      },
      {
        title: intl.formatMessage({id: 'quantity'}),
        dataIndex: 'transactionHash',
        key: 'transactionHash',
        width: '10%',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={record.balance}/>
        }
      },
      {
        title: intl.formatMessage({id: 'percentage'}),
        dataIndex: 'percentage',
        key: 'percentage',
        width: '10%',
        className: 'ant_table',
        render: (text, record, index) => {
          return <div><FormattedNumber
              value={(((record.balance) / token.totalSupply) * 100)}
              minimumFractionDigits={4}
              maximumFractionDigits={4}
          /> %
          </div>

        }
      }
    ];

    return column;
  }

  render() {
    let {addresses, total, loading} = this.state;
    let column = this.customizedColumn();
    if (!loading && addresses.length === 0) {
      return (
          <div className="p-3 text-center">{tu("no_holders_found")}</div>
      );
    }
    return (

        <div className="row transfers">
          <div className="col-md-12">

            <SmartTable border={false} loading={loading} column={column} data={addresses} total={total}
                        onPageChange={(page, pageSize) => {
                          this.loadPage(page, pageSize)
                        }}/>
          </div>
        </div>
    )
  }

}

export default injectIntl(TokenHolders);