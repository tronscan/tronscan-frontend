import React, { Component } from "react";
import { FormattedNumber, injectIntl } from "react-intl";
import xhr from "axios/index";
import { Tooltip } from "antd";
import { tu } from "../../utils/i18n";
import { HrefLink } from "./Links";
import { API_URL } from "../../constants";
// import { connect } from "react-redux";

let myTime = 0;
let errorMyTime = 0;
let errortMyClear = null;
class NavTRXPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeoutState: false,
      percent_change_24h: 0,
      USD_Price: 0,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.axiosHandlerError() 
    this.requestUsdPrice();
  }

  axiosHandlerError(){
    //request 
    xhr.interceptors.request.use(config => {
      return config;
      }, err => {
          console.log('Request timed out!' );
          return Promise.resolve(err);
      })
      //Interception in response
      xhr.interceptors.response.use(data => {
          // response deal with 
          if (data&&data.status && data.status == 200 && data.data.status == 'error') {
              console.log(data.data.msg);
              return data;
          }
          return data;
      },err => {
          // response error handle 
          if (err && err.response) {
              
          } else {
            err.message = 'Connection failure!'
          }
          // can not handle this situation in common request
          // if(err){
          //   errorMyTime++;
          //   if (errorMyTime > 2) {
          //     window.clearTimeout(errortMyClear);
          //     // this.setState({
          //     //   timeoutState: true,
          //     // });
          //   } else {
          //     errortMyClear = setTimeout(() => {
          //       this.requestUsdPrice();
          //     }, 3000);
          //     this.setState({
          //       timeoutState: false,
          //     });
          //   }
          // }
          console.log(err,err.message);
          return Promise.resolve(err);
      })
  }

  async requestUsdPrice() {
    let USD_Price,
      myClear = null;
    await xhr
      .get(`${API_URL}/api/token/price?token=trx`)
      .then((res) => {
        if (res && res.data && res.data.price_in_usd) {
          USD_Price = parseFloat(res.data.price_in_usd);
          let percent_change_24h =
          parseFloat(res.data.percent_change_24h).toFixed(2) || 0;
          this.setState({
            percent_change_24h,
            isLoading: false,
            USD_Price,
            timeoutState: false,
          });
        } else {
          USD_Price = 0;
          myTime++;
          this.setState({
            percent_change_24h: 0,
          });
          if (myTime > 3) {
            window.clearTimeout(myClear);
            this.setState({
              timeoutState: true,
            });
          } else {
            myClear = setTimeout(() => {
              this.requestUsdPrice();
            }, 3000);
            this.setState({
              timeoutState: false,
            });
          }
        }
      })
      .catch(function (error) {
        console.log(error,'error');
       
      });
  }

  refreshPrice() {
    this.setState({
      isLoading: true,
      timeoutState: false,
    });
    this.requestUsdPrice();
  }

  render() {
    const { intl,showCurreny,currency } = this.props;
    const {
      timeoutState,
      isLoading,
      percent_change_24h,
      USD_Price,
    } = this.state;
    return (
      <span className="nav-price-wrapper">
        <span className="trxTitle">TRX:</span>
        {timeoutState ? (
          <span className="currentTrxPirce currentTrxPirceNoResult">
            <span style={{ margin: "0 4px"}}>
              {tu("index_page_price_time_out")}
            </span>
            <img
              onClick={() => this.refreshPrice()}
              style={{ display: "inline-block", width: "14px", height: "14px" }}
              src={require("../../images/home/timeout.svg")}
              alt=""
            />
          </span>
        ) : (
          <span className="currentTrxPirceNoTimeout">
            {isLoading ? (
              <span className="currentTrxPirce currentTrxPirceNoResult">
                <span style={{ margin: "0 4px 0 6px",}}>
                  {tu("index_page_price_loading")}
                </span>
                <img
                  style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                  }}
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBiYWNrZ3JvdW5kOiBub25lOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiIHdpZHRoPSIyMDBweCIgaGVpZ2h0PSIyMDBweCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIj4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODAsNTApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMCkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNiIgZmlsbD0iI2M2NDc0NCIgZmlsbC1vcGFjaXR5PSIxIiB0cmFuc2Zvcm09InNjYWxlKDEuNDAyODUgMS40MDI4NSkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSItMC44NzVzIiB2YWx1ZXM9IjEuNSAxLjU7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuODc1cyIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzEuMjEzMjAzNDM1NTk2NDMsNzEuMjEzMjAzNDM1NTk2NDMpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoNDUpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjYiIGZpbGw9IiNjNjQ3NDQiIGZpbGwtb3BhY2l0eT0iMC44NzUiIHRyYW5zZm9ybT0ic2NhbGUoMS40NjUzNSAxLjQ2NTM1KSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjc1cyIgdmFsdWVzPSIxLjUgMS41OzEgMSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjE7MCIgYmVnaW49Ii0wLjc1cyIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTAsODApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoOTApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjYiIGZpbGw9IiNjNjQ3NDQiIGZpbGwtb3BhY2l0eT0iMC43NSIgdHJhbnNmb3JtPSJzY2FsZSgxLjAyNzg1IDEuMDI3ODUpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InNjYWxlIiBiZWdpbj0iLTAuNjI1cyIgdmFsdWVzPSIxLjUgMS41OzEgMSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjE7MCIgYmVnaW49Ii0wLjYyNXMiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZT4KPC9jaXJjbGU+CjwvZz4KPC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4Ljc4Njc5NjU2NDQwMzU3Nyw3MS4yMTMyMDM0MzU1OTY0MykiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSgxMzUpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjYiIGZpbGw9IiNjNjQ3NDQiIGZpbGwtb3BhY2l0eT0iMC42MjUiIHRyYW5zZm9ybT0ic2NhbGUoMS4wOTAzNSAxLjA5MDM1KSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjVzIiB2YWx1ZXM9IjEuNSAxLjU7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuNXMiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZT4KPC9jaXJjbGU+CjwvZz4KPC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwLDUwLjAwMDAwMDAwMDAwMDAxKSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxnIHRyYW5zZm9ybT0icm90YXRlKDE4MCkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNiIgZmlsbD0iI2M2NDc0NCIgZmlsbC1vcGFjaXR5PSIwLjUiIHRyYW5zZm9ybT0ic2NhbGUoMS4xNTI4NSAxLjE1Mjg1KSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjM3NXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC4zNzVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyOC43ODY3OTY1NjQ0MDM1NywyOC43ODY3OTY1NjQ0MDM1NzcpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMjI1KSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI2IiBmaWxsPSIjYzY0NzQ0IiBmaWxsLW9wYWNpdHk9IjAuMzc1IiB0cmFuc2Zvcm09InNjYWxlKDEuMjE1MzUgMS4yMTUzNSkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSItMC4yNXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC4yNXMiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZT4KPC9jaXJjbGU+CjwvZz4KPC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ5Ljk5OTk5OTk5OTk5OTk5LDIwKSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxnIHRyYW5zZm9ybT0icm90YXRlKDI3MCkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNiIgZmlsbD0iI2M2NDc0NCIgZmlsbC1vcGFjaXR5PSIwLjI1IiB0cmFuc2Zvcm09InNjYWxlKDEuMjc3ODUgMS4yNzc4NSkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSItMC4xMjVzIiB2YWx1ZXM9IjEuNSAxLjU7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuMTI1cyIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzEuMjEzMjAzNDM1NTk2NDMsMjguNzg2Nzk2NTY0NDAzNTcpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMzE1KSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI2IiBmaWxsPSIjYzY0NzQ0IiBmaWxsLW9wYWNpdHk9IjAuMTI1IiB0cmFuc2Zvcm09InNjYWxlKDEuMzQwMzUgMS4zNDAzNSkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSIwcyIgdmFsdWVzPSIxLjUgMS41OzEgMSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjE7MCIgYmVnaW49IjBzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz4KPCEtLSBbbGRpb10gZ2VuZXJhdGVkIGJ5IGh0dHBzOi8vbG9hZGluZy5pby8gLS0+PC9zdmc+"
                  alt=""
                />
              </span>
            ) : (
              <span className='normalCurrentTrxPirce'>
                <Tooltip
                  placement="bottom"
                  title={intl.formatMessage({
                    id: "tooltip_trxPrice",
                  })}
                >
                  <HrefLink
                    href="https://coinmarketcap.com/currencies/tron/"
                    target="_blank"
                    className="erhvr-underline-white text-muted"
                  >
                    <span className="currentTrxPirce showPirce">
                      <FormattedNumber value={USD_Price}></FormattedNumber>
                    </span>
                    <span className="currentCurrency currentCurrencyMobile">
                      {"  "}{showCurreny && (currency.toUpperCase())}{"  "}
                    </span>
                    <span
                      className={
                        Number(percent_change_24h) > 0
                          ? "greenPrice currentCurrencyMobile "
                          : "redPrice currentCurrencyMobile "
                      }
                    >
                      {Number(percent_change_24h) === 0 ? (
                        <span>({percent_change_24h}%)</span>
                      ) : (
                        <span>
                          ({Number(percent_change_24h) > 0 ? "+" : ""}
                          {percent_change_24h}%)
                        </span>
                      )}
                    </span>
                  </HrefLink>
                </Tooltip>
              </span>
            )}
          </span>
        )}
      </span>
    );
  }
}

export default injectIntl(NavTRXPrice);
