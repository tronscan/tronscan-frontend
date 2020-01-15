import React, { Fragment }  from 'react';
import { tu } from "../../utils/i18n";
import Overview from "./Overview"
class BestData extends React.Component{
  constructor(){
    super();
  }
  componentDidMount(){

  }

  setTabs(){
    this.setState(prevProps => ({
      loading: false,
      tabs: {
        ...prevProps.tabs,
        overview: {
          id: "Overview",
          path: "",
          label: <span>{tu("data_overview")}</span>,
          cmp: () => (
            <Overview />
          )
        },
        accounts: {
          id: "",
          path: "",
          label: <span>{tu("data_account")}</span>,
          cmp: () => (
            <Overview />
          )
        },
        tokens: {
          id: "",
          path: "",
          label: <span>{tu("data_token")}</span>,
          cmp: () => (
            <Overview />
          )
        },
        contracts: {
          id: "",
          path: "",
          label: <span>{tu("data_contract")}</span>,
          cmp: () => (
            <Overview />
          )
        },
        resources: {
          id: "",
          path: "",
          label: <span>{tu("data_recourse")}</span>,
          cmp: () => (
            <Overview />
          )
        }
      }
    }))
  }

  render(){
    return (
      <main className="container header-overlap token_black">
        <div className="row">
          <div className="col-md-12 ">

          </div>
        </div>
      </main>
    )
  }
}

export default BestData
