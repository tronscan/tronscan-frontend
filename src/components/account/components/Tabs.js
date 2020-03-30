import React,{Component} from "react";
import { tu } from "../../../utils/i18n";
import $ from 'jquery';

class Tabs extends Component{
    constructor(){
        super();
       
        this.state = {
           
        }
    }
    componentDidUpdate(){
       
    }

   
  
      scrollToAnchorTab = (anchorName) => {
        if (anchorName || anchorName === 0) {
          const anchorElement = document.getElementById(anchorName);
          let offsetTop = anchorElement.offsetTop;
          window.scrollTo(0, offsetTop);
          this.props.changeScrollIds(anchorName)
        }
      };
    render(){
        const {tabs,scrollsId} = this.props;
        return (
            <nav className="card-header list-style-body-scroll__header navbar navbar-expand-sm fixed-top" style={{ position: "sticky", zIndex: 10, background: '#f3f3f3', borderBottom: 'none' }}>
            <ul className="nav nav-tabs card-header-tabs navbar-nav">
              {
                Object.values(tabs).map(tab => (
                  <li className="nav-item scroll-li" key={tab.id}>
                    <a href="javascript:"
                      className={`scroll-tab nav-link ${tab.id} ${tab.id === scrollsId ?'active':''}`}
                      key={tab.id}
                      onClick={() => this.scrollToAnchorTab(tab.id)}
                    >
                      {tu(tab.name)}
                    </a>
                  </li>
                ))
              }
            </ul>
          </nav>
        )
    }
}

export default Tabs
