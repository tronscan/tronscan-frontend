import React,{Component} from "react";
import { tu } from "../../../utils/i18n";


class TagList extends Component{
    constructor(){
        super();
       
        this.state = {
           
        }
    }
    componentDidUpdate(){
       
    }

    render(){
        const {tabs,scrollsId} = this.props;
        return (
            <div className="card-header list-style-body-scroll__header navbar navbar-expand-sm fixed-top" style={{ position: "sticky", zIndex: 10, background: '#f3f3f3', borderBottom: 'none' }}>
            
           1111
          </div>
        )
    }
}

export default TagList
