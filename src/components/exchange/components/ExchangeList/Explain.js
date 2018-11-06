import React from "react";
import {tu} from "../../../../utils/i18n";
export function Explain() {

  return (
    <div className="exchange-list-explain p-3">

    <div className="mb-3">{tu("token_application_instructions_title")}</div>
   
    <div className="exchange-list-explain__content p-2">
      <p>{tu("token_application_instructions_1")} {tu("token_application_instructions_2")}
        <a href="https://goo.gl/forms/OXFG6iaq3xXBHgPf2
" target="_blank">{tu("click_here_to_apply")}</a>
      </p>


    </div>

  </div>
  )
}
