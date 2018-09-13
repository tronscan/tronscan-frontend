import React, {Component} from 'react';
import {routes} from "../routes";
import {Route, Switch} from "react-router-dom";
import {filter, isUndefined} from "lodash";
import {doSearch} from "../services/search";


/*function Badge({value}) {
  return <span className="badge badge-pill bg-light align-text-bottom">{value}</span>;
}*/

export default class Content extends Component {

  constructor() {
    super();

    this.state = {
      search: '',
    };
  }

  doSearch = async () => {
    let {search} = this.state;
    let result = await doSearch(search);
    if (result !== null) {
      window.location.hash = result;
    }

    this.setState({
      search: '',
    });
  };

  onSearchKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      this.doSearch();
    }
  };


  render() {

    //let {search} = this.state;
    //let {router} = this.props;
    // let location = router.location ? router.location.key : "";

    return (
        <Switch>
          {routes.map(route => {
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    render={props => (
                        <React.Fragment>
                          <Switch>
                            {
                              route.routes && filter(route.routes, r => !isUndefined(r.path)).map(subRoute => (
                                  <Route
                                      exact={true}
                                      key={subRoute.path}
                                      path={subRoute.path}
                                      component={subRoute.component}/>
                              ))
                            }
                            <Route component={route.component}/>
                          </Switch>

                        </React.Fragment>
                    )}/>
            )
          })
          }
        </Switch>
    )
  }
}
