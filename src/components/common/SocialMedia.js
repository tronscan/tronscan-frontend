import React from "react";
import { Popover } from 'antd';

export class SocialMedia extends React.Component {

    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        let {mediaList=[]} = this.props;
        return (
          mediaList && mediaList.length>0? <div className="d-flex">
          { mediaList.map((media, index) => {
            function addHTTP(str){
              return /^http/.test(str)? str: 'http://'+ str
            }
            return (<div key={index} style={{marginRight: '10px'}}>
            {media.url.length == 1 && media.name != 'Wechat' &&
              <a href={addHTTP(media.url[0])} target="_bank">
                <i className={`${media.name}-active`}></i>
              </a>
            }
            {media.url.length > 1 && media.name != 'Wechat' &&
              <Popover placement="right" content={
                <div className="" style={{maxWidth: '300px'}}>{
                  media.url.map(item => {
                    return <a href={addHTTP(item)} target="_bank" className="d-block popover_text" key={item}>{item}</a>
                  })
                }
                </div>
              }>
                <i className={`${media.name}-active`}></i>
              </Popover>
            }
            {media.name == 'Wechat' &&
              <Popover placement="right" content={
                <div className="" style={{maxWidth: '300px'}}>{
                  media.url.map(item => {
                    return <div key={item}>{item}</div>
                  })
                }
                </div>
              }>
                <i className={`${media.name}-active`}></i>
              </Popover>
            }
              </div>)
          })}
          </div>:<span style={{color: '#d8d8d8'}}>-</span>
        )
    }
}
