let cooking = require('cooking');
let path = require('path');
let config = require('../../build/config');

cooking.set({
  entry: {
    index: path.join(__dirname, 'index.js')
  },
  dist: path.join(__dirname, 'lib'),
  template: false,
  format: 'umd',
  moduleName: 'ElCascader',
  extends: ['vue2'],
  alias: config.alias,
  externals: { vue: config.vue }
});

module.exports = cooking.resolve();
