import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

const CONFIG_FILE = path.join(os.homedir(), '.gstp-config');

export interface Config {
  most_recent_starred_at?: string; // ISO-8601
}

export async function loadConfig(): Promise<Config> {
  try {
    await access(CONFIG_FILE, fs.constants.F_OK | fs.constants.W_OK);
    const file = await readFile(CONFIG_FILE, {
      encoding: 'utf8',
    });
    return JSON.parse(file.toString());
  } catch (e) {
    return {};
  }
}

export async function writeConfig(config: Config) {
  try {
    return writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), {
      encoding: 'utf8',
    });
  } catch (e) {
    console.error(e);
  }
}

export async function updateConfig(
  config: Config,
  nextMostRecentStarredAt: string
) {
  const next = new Date(nextMostRecentStarredAt);

  if (config.most_recent_starred_at) {
    const current = new Date(config.most_recent_starred_at);
    if (next > current) {
      config.most_recent_starred_at = nextMostRecentStarredAt;
    }
  } else {
    config.most_recent_starred_at = nextMostRecentStarredAt;
  }

  await writeConfig(config);
  return config;
}
