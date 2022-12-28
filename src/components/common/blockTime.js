import React from "react";
import {injectIntl} from "react-intl";
import {setTimeString} from '../../utils/DateTime'

class BlockTime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time:props.time,
      newTime:setTimeString(props.time),
      timer:null
    };
  }

  componentWillMount() {
    this.updateTime()
  }

  updateTime(){
    let timer = setInterval(()=>{
      this.setState({
        newTime:setTimeString(this.props.time)
      })
    },1000)

    this.setState({
      timer:timer
    })
  }

  componentWillUnmount(){
      clearInterval(this.state.timer);
  }

  render() {
    let {newTime} = this.state;
    return (
        <div className="token_black table_pos">
          <div>{newTime}</div>
        </div>
    )
  }
}


export default injectIntl(BlockTime)