export default class App {

  constructor(options = {}) {
    this.options = options;

    this.setExternalLinkHandler(null);
  }

  setExternalLinkHandler(handler) {
    this.externalLinkHandler = handler;
  }

  getExternalLinkHandler() {
    return this.externalLinkHandler;
  }
}
