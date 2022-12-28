import React from "react";
import { isAddressValid } from "@tronscan/client/src/utils/crypto";

export function Truncate({children}) {
    return (
        <div className="truncate-ellipsis">
            <span>{children}</span>
        </div>
    )
}

export function TruncateAddress({children,address}) {
    let children_start = children.substring(0,29);
    let children_end  =  children.substring(29,34);
    return (
        <div>
            {
                isAddressValid(children) ? 
                (
                    address?
                    <div style={{display: 'table',tableLayout: 'fixed',width: '100%',whiteSpace: 'nowrap'}}>
                        <div className="ellipsis_box">
                            <div className="ellipsis_box_start">{children_start}</div>
                            <div className="ellipsis_box_end">{children_end}</div>
                        </div>
                    </div>:
                    <div className="ellipsis_box">
                        <div className="ellipsis_box_start">{children_start}</div>
                        <div className="ellipsis_box_end">{children_end}</div>
                    </div>
                )
              :
                <div className="truncate-ellipsis">
                    <span>{children}</span>
                </div>
            }
        </div>

    )
}