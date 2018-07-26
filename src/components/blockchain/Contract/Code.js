import React from "react";
import {tu} from "../../../utils/i18n";

export default class Code extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {

  }

  render() {

    return (
        <table className="table table-hover m-0 border-top-0">
          <thead className={theadClass}>
          <tr>
            <th className="" style={{width: 150}}>{tu("hash")}</th>
            <th className="">{tu("block")}</th>
            <th className="">{tu("age")}</th>
            <th className="">{tu("from")}</th>
            <th className="">{tu("to")}</th>
            <th className="">{tu("value")}</th>
            <th className="">{tu("fee")}</th>
          </tr>
          </thead>
          <tbody>
    )
  }
}
