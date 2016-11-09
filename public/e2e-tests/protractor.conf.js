exports.config = {
  allScriptsTimeout: 30000,

  specs: [
    '*.js'
  ],
  directConnect: true,
  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://127.0.0.1:3000/app/',

  framework: 'jasmine',

  directConnect: true,

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
