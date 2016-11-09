const env = process.env.NODE_ENV || "development";
const target = process.env.NODE_TARGET || "main";
const config = require(`./scripts/webpack/config/${target}/${env}.js`);

export default config;
