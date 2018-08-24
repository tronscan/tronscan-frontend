import React from "react";
import {tu, t} from "../../utils/i18n";
import {BarLoader} from "./loaders";
import {connect} from "react-redux";
import {KEY_ENTER} from "../../utils/constants";


class Paging extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      page: 1,
      pageSize: 40,
      pageSizeOptions: [20, 40, 60, 80]
    };
  }

  changePage = (page) => {
    this.setState({page: page});
    let {onChange} = this.props;
    let {pageSize} = this.state;
    onChange && onChange(page, pageSize);
  };

  changePageSize = (pageSize) => {
    this.setState({pageSize: pageSize}, () => {
      this.changePage(1);
    });
  };

  onKeyDown = (e) => {
    let page = this.setPage(e);
    if (e.keyCode === KEY_ENTER)
      this.changePage(page);
  };
  onBlur = (e) => {
    let page = this.setPage(e);
    this.changePage(page);
  }
  setPage = (e) => {
    let {total} = this.props;
    let {pageSize} = this.state;
    let totalPages = Math.ceil(total / pageSize);
    let page = parseInt(e.target.value);

    if (isNaN(page))
      page = 1;
    else if (page <= 0)
      page = 1;
    else if (page > totalPages)
      page = totalPages;

    return page
  }

  renderButton(page) {
    let {url} = this.props;

    /*
    if (url) {
      return ({children}) => (
        <Link className="page-link" to={`${url}?page=${page}`}>
          {children}
        </Link>
      );
    } else {
    */
    return ({children}) => (
        <a className="page-link" href="javascript:" onClick={() => this.changePage(page)}>
          {children}
        </a>
    );
    /* }*/
  }

  render() {

    let {total, className, loading = false, showPageSize = true} = this.props;
    let {page, pageSize, pageSizeOptions} = this.state;

    let totalPages = Math.ceil(total / pageSize);
    totalPages = totalPages <= 0 ? 1 : totalPages;

    let showFirst = page === 1;
    let showLast = !(totalPages > page);

    let FirstButton = this.renderButton(1);
    let PreviousButton = this.renderButton(page - 1);
    let NextButton = this.renderButton(page + 1);
    let LastButton = this.renderButton(totalPages);

    return (
        <div className="d-flex">
          {
              !(showFirst && "invisible") && <ul className={"pagination p-0 my-0 " + className}>
                <li className={"page-item " + (showFirst && "invisible")}>
                  <FirstButton>
                    <i className="fas fa-fast-backward mr-sm-2"/>
                    <span className="d-none d-lg-inline-block">{tu("first_page")}</span>
                  </FirstButton>
                </li>
                <li className={"page-item " + (showFirst && "invisible")}>
                  <PreviousButton>
                    <i className="fas fa-step-backward mr-sm-2"/>
                    <span className="d-none d-lg-inline-block">{tu("previous_page")}</span>
                  </PreviousButton>
                </li>
              </ul>
          }
          <ul className="pagination p-0 my-0 mx-auto">
            <li className="mx-auto page-item">
              {
                loading ?
                    <span className="page-link no-hover" style={{
                      paddingTop: '17px',
                      paddingBottom: '17px',
                      paddingRight: '33px',
                      paddingLeft: '33px'
                    }}>
                       <BarLoader/>
                    </span> :
                    <span className="page-link">
                      {tu("page")}{' '}
                      <input className='inputForPaging' type='text'
                             placeholder={page}
                             onKeyDown={(event) => {
                               this.onKeyDown(event)
                             }}
                             onBlur={(event) => {
                               this.onBlur(event)
                             }}/>
                      {' '}{t("of")} {totalPages}
                    </span>
              }
            </li>
          </ul>
          {
          !(showLast && "invisible")&& <ul className="pagination p-0 my-0 ">
            <li className={"page-item " + (showLast && " invisible")}>
              <NextButton>
                <span className="d-none d-lg-inline-block">{tu("next_page")}</span>
                <i className="fas fa-step-forward ml-sm-2"/>
              </NextButton>
            </li>
            <li className={"page-item " + (showLast && " invisible")}>
              <LastButton>
                <span className="d-none d-lg-inline-block">{tu("last_page")}</span>
                <i className="fas fa-fast-forward ml-sm-2"/>
              </LastButton>
            </li>
          </ul>
          }
          {
            showPageSize &&
            <ul className="pagination  p-0 my-0 ml-1">
              <li className="page-item input-group">
                <a className="page-link" href="javascript:">
                  <span className="d-none d-md-inline-block">{tu("page_size")}:</span>
                  <select className="ml-sm-2 border-0 bg-white selectForPaging custom-select" id="inputGroupSelect"
                          onChange={(ev) => this.changePageSize(ev.target.value)} value={pageSize}>
                    {
                      pageSizeOptions.map((size, index) => (
                          <option key={index} value={size}>{size}</option>
                      ))
                    }
                  </select>
                </a>
              </li>
            </ul>
          }
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Paging);
