import React from "react";
import {tu} from "../utils/i18n";
import {Table, Input, Button, Icon} from 'antd';
import $ from 'jquery';

export default class SearchInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    }
  }

  componentDidMount() {
    $('.dropdown').on('show.bs.dropdown', () => {
      setTimeout(() => {
        this.searchInput && this.searchInput.focus();
      }, 100);
    })
  }

  onInputChange = (e) => {
    this.setState({searchText: e.target.value});
  }
  onReset = () => {
    this.setState({searchText: ''}, () => {
      this.onSearch();
    });
  }
  onSearch = () => {
    //$('#dropdownMenuButton').dropdown("toggle");
    let {searchText} = this.state;
    this.props.search(searchText);
  }
  onPressEnter = () => {
    $('#dropdownMenuButton').dropdown("toggle");
    this.onSearch();
  }

  render() {
    return (
        <span className="dropdown">
          <span id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className={"fa fa-filter ml-2"}/>
          </span>
          <div className="custom-filter-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton">
            <Input
                ref={ele => this.searchInput = ele}
                placeholder="Search name" type="text" className="ant-input"
                value={this.state.searchText}
                onChange={this.onInputChange}
                onPressEnter={this.onPressEnter}/>
            <Button type="primary" onClick={this.onSearch}>{tu("search")}</Button>
            <Button className="btn-secondary ml-1" onClick={this.onReset}>{tu("reset")}</Button>
          </div>
        </span>
    )
  }
};

