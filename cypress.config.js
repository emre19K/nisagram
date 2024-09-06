const { defineConfig } = require("cypress");

module.exports = defineConfig({
  //MAILISK VARIABLEN für developerEmail server der zum testen vom login benutzt wird
  env:{
    MAILISK_API_KEY: "nlX9oje61TsIwZOnoSh5i1pu0LERINktjn_vYs209aE",
    MAILISK_NAMESPACE: "t5avqitwahc1",
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(_on, _config) {
      // eslint-disable-next-line no-unused-vars
      // implement node event listeners here
    },
  },
});
