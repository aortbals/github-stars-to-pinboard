import { PinboardAPIClient } from '../lib/pinboard';
import { GithubAPIClient } from '../lib/github';
import { loadConfig, updateConfig } from '../utils/config';
import { PinboardPostsAddParams } from '../lib/pinboard/types';

const DEFAULT_TAG = 'github-starred';

export interface MainParams {
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
  /**
   * Disable config file starred_at tracking functionality
   */
  disableConfig?: boolean;
  /**
   * Pinboard API/Auth Token
   */
  pinboardAPIToken: string;
  /**
   * GitHub Access Token
   */
  githubAccessToken: string;
}

export async function main(params: MainParams) {
  const pinboardAPIClient = new PinboardAPIClient({
    authToken: params.pinboardAPIToken,
  });
  const githubAPIClient = new GithubAPIClient({
    authToken: params.githubAccessToken,
  });
  let config = params.disableConfig ? undefined : await loadConfig();
  const processed: PinboardPostsAddParams[] = [];

  if (config && config.most_recent_starred_at) {
    console.log(
      `Checking for GitHub starred repos since ${new Date(
        config.most_recent_starred_at
      ).toLocaleString()}…\n`
    );
  }

  for await (const stars of githubAPIClient.listReposStarredByAuthenticatedUser(
    {
      sinceStarredAt: config ? config.most_recent_starred_at : undefined,
      paginationPageLimit: params.paginationPageLimit,
      perPage: params.perPage,
    }
  )) {
    for (let star of stars) {
      try {
        const bookmark = {
          url: star.repo.html_url,
          description: star.repo.name || undefined,
          extended: star.repo.description,
          dt: star.starred_at,
          tags: star.repo.topics
            ? `${DEFAULT_TAG},${star.repo.topics.join(',')}`
            : DEFAULT_TAG,
        };
        await pinboardAPIClient.add(bookmark);
        processed.push(bookmark);
        if (config) {
          config = await updateConfig(config, star.starred_at);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  return processed;
}
