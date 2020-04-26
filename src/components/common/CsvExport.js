import React, {Fragment} from "react";
import { Modal, Button } from 'antd';
import ContractCodeRequest from "../tools/ContractCodeRequest";
import {tu} from "../../utils/i18n";
import xhr from "axios/index";



export class CsvExport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            captcha_code:true,
        };
    }

    handleOk = e => {
        let {downloadURL} = this.props;
       window.location.href = downloadURL
    };
    handleCaptchaCode = async (val) => {
        let {downloadURL} = this.props;
        // const {data} = await xhr.get(`${downloadURL}&g-recaptcha-response=${val}`)
        if(val){
            window.location.href = `${downloadURL}&g-recaptcha-response=${val}`
            setTimeout(() => {
                this.setState({visible: false});
            }, 300);
            
        }
        this.setState({captcha_code: false}, () => {
            this.setState({captcha_code: true})
        });
    };
    

    render() {
        return (
            <Fragment>
                <div style={{marginTop: 20, float: 'right'}}><i size="1" style={{fontStyle: 'normal'}}>[
                    Download <a href="javascript:;" onClick={() => this.setState({ visible: true})} style={{color: '#C23631'}}><b>CSV Export</b></a>&nbsp;<span
                        className="glyphicon glyphicon-download-alt"></span> ]</i>&nbsp;
                </div>
                <Modal
                    visible={this.state.visible}
                    okText="Download"
                    footer={null}
                    onCancel={() => this.setState({ visible: false})}
                    // centered
                >   
                    <div className="pt-3">{
                        this.state.captcha_code?
                        <ContractCodeRequest  handleCaptchaCode={this.handleCaptchaCode} className={this.state.visible? 'd-block': 'd-none'}/>
                        :''
                    }
                        
                    </div>
                    
                    {/**<button 
                        className="btn btn-danger d-block mx-auto mt-3" 
                        disabled={!this.state.captcha_code}
                        onClick={this.handleOk}>{tu('Download')}</button> */}
                </Modal>
            </Fragment>

        )
    }
}
