if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { GithubAPIClient } from '.';

describe('GithubAPIClient', () => {
  let client: GithubAPIClient;

  beforeAll(() => {
    client = new GithubAPIClient({
      authToken: process.env.GITHUB_ACCESS_TOKEN as string,
    });
  });

  describe('#listReposStarredByAuthenticatedUser', () => {
    it('can request a single page with page size', async () => {
      for await (const stars of client.listReposStarredByAuthenticatedUser({
        perPage: 2,
        paginationPageLimit: 1,
      })) {
        expect(stars).toMatchSnapshot();
      }
    });

    it('can request multiple pages with a limit', async () => {
      for await (const stars of client.listReposStarredByAuthenticatedUser({
        perPage: 2,
        paginationPageLimit: 2,
      })) {
        expect(stars).toMatchSnapshot();
      }
    });

    it('can limit by a starred_at date', async () => {
      for await (const stars of client.listReposStarredByAuthenticatedUser({
        perPage: 2,
        sinceStarredAt: '2019-09-21T16:47:07Z',
      })) {
        expect(stars.length).toEqual(1);
      }
    });
  });
});
