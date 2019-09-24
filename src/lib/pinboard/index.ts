import fetch from 'node-fetch';
import querystring from 'querystring';
import { RateLimit } from 'async-sema';
import chalk from 'chalk';
import Debug from 'debug';

import { RATE_LIMIT_SECONDS } from '../../utils/rate-limit';
import { PinboardPostsAddParams } from './types';

const scrub = (fn: (text: string) => void) => (arg: any) =>
  fn(
    arg.replace ? arg.replace(/auth_token=[^?&]+/g, 'auth_token=REDACTED') : arg
  );

const log = scrub(Debug('pinboard'));
const debug = scrub(Debug('pinboard:debug'));

export interface PinboardAPIClientParams {
  authToken: string;
}

export class PinboardAPIClient {
  private authToken: string;
  private baseUrl = 'https://api.pinboard.in/v1';
  private rateLimit = RateLimit(RATE_LIMIT_SECONDS, {
    uniformDistribution: true,
  });

  constructor({ authToken }: PinboardAPIClientParams) {
    this.authToken = authToken;
  }

  public add = async (params: PinboardPostsAddParams) => {
    await this.rateLimit();

    try {
      const response = await this.sendRequest(params);

      if (!response.ok) {
        log(
          `${chalk.red('ERROR')} HTTP ${response.status} ${
            response.statusText
          } ${params.url}`
        );
        return;
      }

      const json = await response.json();
      log(`${chalk.green('OK')} ${params.url} ${json.result_code}`);
      debug(json);
      return json;
    } catch (e) {
      log(`${chalk.red('ERROR')} ${params.url} ${e.message}`);
    }
  };

  private sendRequest = async (params: PinboardPostsAddParams) => {
    const requestParams: PinboardPostsAddParams = {
      auth_token: this.authToken,
      format: 'json',
      ...params,
    };
    const url = `${this.baseUrl}/posts/add?${querystring.encode(
      requestParams
    )}`;

    log(`${chalk.blue('GET')} ${url}`);

    return fetch(url);
  };
}
