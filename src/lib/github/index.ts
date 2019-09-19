import fetch from 'node-fetch';
import { RateLimit } from 'async-sema';
import chalk from 'chalk';
import Debug from 'debug';

import { RATE_LIMIT_SECONDS } from '../../utils/rate-limit';
import { UserStarredResponse } from './types';
import { URL } from 'url';

const log = Debug('github');
const debug = Debug('github:debug');

export interface GithubAPIClientParams {
  authToken: string;
}

interface ListReposStarredByAuthenticatedUserParams {
  /**
   * Requests per page
   */
  perPage?: number;
  /**
   * Limit pagination requests
   */
  paginationPageLimit?: number;
  /**
   * Limit pagination to stars more recent than this date
   */
  sinceStarredAt?: string;
}

export class GithubAPIClient {
  private authToken: string;
  private baseUrl = 'https://api.github.com';
  private rateLimit = RateLimit(RATE_LIMIT_SECONDS, {
    uniformDistribution: true,
  });

  constructor({ authToken }: GithubAPIClientParams) {
    this.authToken = authToken;
  }

  /**
   * An async generator for listing an authenticated user's GitHub
   * stars that supports pagination and the ability to limit the
   * crawl since a particular `starred_at` date.
   */
  public async *listReposStarredByAuthenticatedUser(
    params: ListReposStarredByAuthenticatedUserParams = {}
  ) {
    let urlObject = new URL(`${this.baseUrl}/user/starred`);
    if (params.perPage) {
      urlObject.searchParams.append('per_page', params.perPage.toString());
    }
    let url = urlObject.toString();
    let requestCount = 0;

    while (
      url &&
      (params.paginationPageLimit
        ? requestCount < params.paginationPageLimit
        : true)
    ) {
      try {
        requestCount++;
        await this.rateLimit();
        const response = await this.sendRequest(url);

        if (!response.ok) {
          log(
            `${chalk.red('ERROR')} HTTP ${response.status} ${
              response.statusText
            } ${response.url}`
          );
          return;
        }

        const json: UserStarredResponse = await response.json();
        log(`${chalk.green('OK')} ${response.url}`);
        debug(json);

        if (params.sinceStarredAt) {
          const filteredItems = json.filter(
            (i: any) =>
              new Date(i.starred_at) > new Date(params.sinceStarredAt as string)
          );

          yield filteredItems;

          if (filteredItems.length < json.length) {
            log(
              `${chalk.blue('DONE')} all starred repos seen since ${new Date(
                params.sinceStarredAt
              ).toLocaleString()}`
            );
            return;
          }
        } else {
          yield json;
        }

        const next = this.parseNextLink(
          response.headers.get('link') || undefined
        );
        if (next) url = next;
      } catch (e) {
        log(`${chalk.red('ERROR')} ${e.message}`);

        return;
      }
    }
  }

  private sendRequest = async (url: string) => {
    log(`${chalk.blue('GET')} ${url}`);
    return fetch(url, {
      headers: {
        // Included starred_at date, include topics
        accept:
          'application/vnd.github.v3.star+json, application/vnd.github.mercy-preview+json',
        authorization: `token ${this.authToken}`,
      },
    });
  };

  private parseNextLink = (link?: string) => {
    return ((link || '').match(/<([^>]+)>;\s*rel="next"/) || [])[1];
  };
}
