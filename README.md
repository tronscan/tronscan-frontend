<h1 align="center">
  <br>
  <img width="40%" src="https://raw.githubusercontent.com/tron-explorer/docs/master/images/tron-banner.png">
  <br>
  Tronscan Frontend
  <br>
</h1>

<h4 align="center">
  React.js Frontend for <a href="https://tronscan.org">Tronscan.org</a>
</h4>

<p align="center">
  <a href="#requirements">Requirements</a> •
  <a href="#installation">Running</a> •
  <a href="https://tronscan.org">tronscan.org</a>
</p>

## Features

* All information from the blockchain viewable
* Web Wallet
* Super Representative Voting
* Node Tester
* Transaction Debugger
* Notifications
* Poloni DEX Information
* News
* Node Overview
* Basic info browser
* Quick search token
* Web wallet
* Poloni DEX
* DApp Recommend
* Vote for SR
* TRON Committee
* Token List
* Contract Deploy& Verify
* DAppChain
* Node Tester
* Transaction Debugger

# Requirements

* node.js
* yarn

# Running

```bash
> yarn install
> yarn start
```

## Configuring API URL

By default the Explorer will connect to https://api.tronscan.org for its data. 

When developing locally the url can be changed by defining the `API_URL` environment variable

```bash
> API_URL=http://127.0.0.0:9000 yarn start
```

