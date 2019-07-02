import React, {Fragment} from "react";



export class CsvExport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        let {downloadURL} = this.props;
        return (
            <Fragment>
                <div style={{marginTop: 20, float: 'right'}}><i size="1" style={{fontStyle: 'normal'}}>[
                    Download <a href={downloadURL} style={{color: '#C23631'}}><b>CSV Export</b></a>&nbsp;<span
                        className="glyphicon glyphicon-download-alt"></span> ]</i>&nbsp;
                </div>
            </Fragment>

        )
    }
}
