const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');

async function getConfigurationByFile(file) {
  const pathToConfigFile = path.join(__dirname, 'cypress', 'e2e', 'config', `${file}.json`);
  return fs.readJson(pathToConfigFile);
}

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://practicetestautomation.com/practice-test-login/',
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: false,
      json: true,
    },
    async setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      const file = config.env.configFile || 'qa'; // Default to 'qa.json' if no config file is specified

      // Wait for the async function to resolve
      const customConfig = await getConfigurationByFile(file);

      // Merge customConfig.env into config.env
      config.env = { ...config.env, ...customConfig.env };

      return config;
    },
  },
});
