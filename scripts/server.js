import express              from "express";
import webpack              from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import minimist             from "minimist";
import { spawn }            from "child_process";

import config from "./webpack/config/renderer/development.js";

const ARGV = minimist(process.argv.slice(2));
const PORT = process.env.PORT || 8888;

const app       = express();
const compiler  = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
  },
}));

app.use(webpackHotMiddleware(compiler));

const server = app.listen(PORT, "localhost", err => {
  if (err) {
    return console.log(err);
  }

  if (ARGV["start-dev"]) {
    spawn("npm", ["start"], { shell: true, env: process.env, stdio: "inherit" })
      .on("close", code => process.exit(code))
      .on("error", err => console.error(err));
  }

  console.log(`Listening at http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("Stopping dev server");
  wdm.close();
  server.close(() => {
    process.exit(0);
  });
});
