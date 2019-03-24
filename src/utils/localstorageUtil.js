let instance;

class Local {
  constructor () {
    this.local = window.localStorage;
  }

  setItem (key, value) {
    const valueItem = JSON.stringify(value);
    this.local.setItem(key, valueItem);
  }

  getItem (key) {
    const valueItem = this.local.getItem(key);
    return JSON.parse(valueItem);
  }

  updateItem (key, value) {
    this.local.removeItem(key);
    const valueItem = JSON.stringify(value);
    this.local.setItem(key, valueItem);
  }

  removeItem (key) {
    this.local.removeItem(key);
  }

  static getInstance = () => {
    if (!instance) {
      instance = new Local();
    }

    return instance;
  }
}

export default Local;
