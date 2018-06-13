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
* Market Information
* News
* Node Overview

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

## Building Desktop Apps

Tronscan.org can be published as a Desktop app wrapped in Electron.

To build a Windows, Mac and Linux app run the following command:

```bash
> yarn desktop:build:full
```

And to run, make sure to start the web app first:
```bash
> yarn start
```
and then run the desktop version:
```bash
> yarn desktop:start
```
