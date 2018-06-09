import React from "react";
import {Link} from "react-router-dom";
import {tu} from "../../utils/i18n";
import {BarLoader} from "./loaders";

export default class Paging extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      page: 0,
    };
  }

  changePage = (page) => {
    let {onChange} = this.props;
    onChange && onChange({ page });
  };

  renderButton(text, page) {
    let {url} = this.props;

    if (url) {
      return ({children}) => (
        <Link className="page-link" to={`${url}?page=${page}`}>
          {children}
        </Link>
      );
    } else {
      return ({children}) => (
        <a className="page-link" href="javascript:" onClick={() => this.changePage(page)}>
          {children}
        </a>
      );
    }
  }

  render() {

    let {page, total, pageSize, className, loading = false, ...props} = this.props;

    let totalPages = Math.floor(total / pageSize);

    let showFirst = page === 0;
    let showLast = !(totalPages > (page + 1));

    let FirstButton = this.renderButton(tu("first_page"), 0);
    let PreviousButton = this.renderButton(tu("previous_page"), page - 1);
    let NextButton = this.renderButton(tu("next_page"), page + 1);
    let LastButton = this.renderButton(tu("last_page"), totalPages - 1);

    return (
      <div className="d-flex">
        <ul className={"pagination p-0 my-0 " + className} {...props}>
          <li className={"page-item " + (showFirst && "invisible")}>
            <FirstButton>
              <i className="fas fa-fast-backward mr-sm-2" />
              <span className="d-none d-sm-inline-block">{tu("first_page")}</span>
            </FirstButton>
          </li>
          <li className={"page-item " + (showFirst && "invisible")}>
            <PreviousButton>
              <i className="fas fa-backward mr-sm-2" />
              <span className="d-none d-sm-inline-block">{tu("previous_page")}</span>
            </PreviousButton>
          </li>
        </ul>
        <ul className="pagination p-0 my-0 mx-auto">
          <li className="mx-auto page-item">
            {
              loading ?
                <span className="page-link no-hover" style={{padding: 13 }}>
                  <BarLoader/>
                </span> :
                <span className="page-link no-hover">{tu("page")} {page + 1} {tu("of")} {totalPages}</span>
            }
          </li>
        </ul>
        <ul className="pagination p-0 my-0 ">
          <li className={"page-item " + (showLast && " invisible")}>
            <NextButton>
              <span className="d-none d-sm-inline-block">{tu("next_page")}</span>
              <i className="fas fa-forward ml-sm-2" />
            </NextButton>
          </li>
          <li className={"page-item " + (showLast && " invisible")}>
            <LastButton>
              <span className="d-none d-sm-inline-block">{tu("last_page")}</span>
              <i className="fas fa-fast-forward ml-sm-2" />
            </LastButton>
          </li>
        </ul>
      </div>
    );
  }
}
