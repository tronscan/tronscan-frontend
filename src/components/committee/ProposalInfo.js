import React, {Fragment} from "react";
import {tu} from "../../utils/i18n";
import { Table } from 'antd';
import { filter, map ,upperFirst} from 'lodash'
import {Client} from "../../services/api";
import {Link} from "react-router-dom";
import SmartTable from "../common/SmartTable.js"
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TronLoader} from "../common/loaders";
import {AddressLink} from "../common/Links";


class ProposalInfo extends React.Component {

    constructor(match) {
        super();
        this.state = {
            data:null
        };
    }

    componentDidMount() {
        let {match} = this.props;
        this.loadProposal(match.params.id)
    }

    async loadProposal (id){
        let {data} = await Client.getProposalById(id);
        this.setState({
            data: data
        })
    }


    render() {
        let {data} = this.state;
        return (
            <main className="container header-overlap committee">

            </main>
        )
    }
}


export default injectIntl(ProposalInfo);
