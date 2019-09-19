import path from 'path';

require('dotenv').config();

process.env.JEST_PLAYBACK_MODE = process.env.JEST_PLAYBACK_MODE || 'play';
require('jest-playback').setup(path.join(__dirname, 'src'));

if (process.env.JEST_PLAYBACK_MODE !== 'record') {
  process.env.GITHUB_ACCESS_TOKEN = 'REDACTED';
  process.env.PINBOARD_API_TOKEN = 'REDACTED';
}

if (process.env.JEST_PLAYBACK_MODE === 'record') {
  // eslint-disable-next-line
  jest.setTimeout(60000);
}
