if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

if (!module.parent) {
  process.env.DEBUG = process.env.DEBUG || 'github,pinboard';
}

if (!process.env.GITHUB_ACCESS_TOKEN) {
  console.log("'GITHUB_ACCESS_TOKEN' environment variable is required.");
  process.exit(1);
}

if (!process.env.PINBOARD_API_TOKEN) {
  console.log("'PINBOARD_API_TOKEN' environment variable is required.");
  process.exit(1);
}

import { main } from './cli';
import chalk from 'chalk';

async function run() {
  const processed = await main({
    githubAccessToken: process.env.GITHUB_ACCESS_TOKEN as string,
    pinboardAPIToken: process.env.PINBOARD_API_TOKEN as string,
  });

  console.log(
    `\n${chalk.green('FINISHED')} processed ${processed.length} items.`
  );
  process.exit();
}

if (!module.parent) {
  run();
}
