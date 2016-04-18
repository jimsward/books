exports.config = {
  allScriptsTimeout: 22000,

  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:3000/app/',

  framework: 'jasmine',
  
  directConnect: true,

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
