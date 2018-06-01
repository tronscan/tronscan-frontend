import {getQueryParam} from "./url";
import {isNaN} from "lodash";


export function checkPageChanged(cmp, callback) {
  let {page} = cmp.state;
  let {location} = cmp.props;

  let nextPage = getQueryParam(location, "page", 0);
  nextPage = parseInt(nextPage);

  if (!isNaN(nextPage) && page !== nextPage) {
    cmp.setState({
      page: nextPage,
    }, () => {
      callback && callback(nextPage);

    });

  }
}
