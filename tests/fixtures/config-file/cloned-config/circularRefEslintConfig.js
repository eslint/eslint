let errorConfig = ["error", {}];

class CircularRef {
  constructor() {
    this.self = this;
  }
}

module.exports = {
  settings: {
    sharedData: new CircularRef()
  },

  rules: { camelcase: errorConfig, "default-case": errorConfig }
};
