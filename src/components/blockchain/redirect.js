import React from 'react';
import {withRouter} from "react-router-dom";


class Redirect extends React.Component {

    constructor(props) {
        super(props);
        this.props.history.push("/blockchain/blocks");
    }
    render(){
        return (<div></div>)
    }

}

export default withRouter(Redirect);