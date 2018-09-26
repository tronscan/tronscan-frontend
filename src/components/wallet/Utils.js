import {renderToString} from "react-dom/server";
import PaperWallet from "./PaperWallet";
import React from "react";
import {GenerateQRCode} from "../../services/qrcode";

const stylesheetTag = (sheet) => `<link rel="stylesheet" href="${sheet}" type="text/css" />`;

export async function printPaperWallet(address, privateKey) {

  let addressQRCode = await GenerateQRCode(address);
  let privateKeyQRCode = await GenerateQRCode(privateKey);

  const reactAppString = renderToString(
      <PaperWallet
          addressQRCode={addressQRCode}
          privateKeyQRCode={privateKeyQRCode}
          address={address}
          privateKey={privateKey}/>);
  const appStyles = '';
  const css = [
    require("!!file-loader!bootstrap/dist/css/bootstrap.css"),
  ];
  const style = css.map(sheet => stylesheetTag(sheet)).join('');

  const html = `
    <html>
      <head>
        ${style}
      </head>
      <body style="background-color: white;">
        <div id="app">${reactAppString}</div>
          <style>${appStyles}</style>
            
          <script type="text/javascript">
            setTimeout(function () { window.print(); }, 2000);
          </script>
      </body>
    </html>
  `;

  const win = window.open('about:blank', '_blank');
  win.document.write(html);
}

