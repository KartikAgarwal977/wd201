module.exports = {
  chromeWebSecurity: false,
  e2e: {
    specPattern: "cypress/integration/**/*.spec.js", // Update this pattern according to your file structure
    setupNodeEvents() {
      // implement node event listeners here
    },
    supportFile: false,
  },
};
