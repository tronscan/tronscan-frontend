import React, { Component } from "react";
import { HrefLink } from "../common/Links";
import { tu } from "../../utils/i18n";

export default class About extends Component {

  constructor(prop){
    super()
    this.state = {
      imgList:[
        {"name":"Skye","img":"pic5.png"},
        {"name":"Ariml","img":"pic2.png"},
        {"name":"HarryXu","img":"pic1.png"},
        {"name":"Lee","img":"pic6.png"},
        {"name":"Zach","img":"pic4.png"},
        {"name":"Vincent Lau","img":"pic7.png"},
      ] 
    }
  }
  render() {
    let { imgList } = this.state;

    return (
      <main className="container header-overlap news about">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="about_item">
                  <h3>{tu("what_we_do")}</h3>
                  <p>{tu("Transcan_desc")}</p>
                </div>
                <div className="about_item">
                  <h3>{tu("Our_team")}</h3>
                  <p>{tu("Team_desc")}</p>
                  <div className="about_img_list row"> 
                  
                  { 
                    imgList.map((item) =>(
                      <div className="col-xs-12 col-sm-4 col-md-4 img_box" key={item.name}>
                          <img className="img_item" src={require(`../../images/photo/${item.img}`)}/>
                          <div className="img_desc">
                              <p>{item.name}</p>
                              <p className="desc_none">{tu(item.name)}</p>
                          </div>
                        </div>  
                    ))
                  }
                      
                      {/* <div className="col-xs-12 col-sm-4 col-md-4 img_box">
                        <img className="img_item" src={require("../../images/icon2.png")}/>
                        <div className="img_desc">
                            <p>jerry xu</p>
                            <p className="desc_none">front-end engineer</p>
                        </div>
                      </div>  
                      <div className="col-xs-12 col-sm-4 col-md-4 img_box">
                        <img className="img_item" src={require("../../images/icon3.png")}/>
                        <div className="img_desc">
                            <p>jerry xu</p>
                            <p>front-end engineer</p>
                        </div>
                      </div>   */}
                  </div>
                </div>
                <div className="about_item">
                  <h3>{tu("User_many")}</h3>
                  <p>{tu("User_many_desc")}</p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
