if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { PinboardAPIClient } from '.';

describe('PinboardAPIClient', () => {
  let client: PinboardAPIClient;

  beforeAll(() => {
    client = new PinboardAPIClient({
      authToken: process.env.PINBOARD_API_TOKEN as string,
    });
  });

  describe('#listReposStarredByAuthenticatedUser', () => {
    it('can request a single page with page size', async () => {
      expect(
        await client.add({
          url: 'https://github.com/zeit/async-sema',
          description: 'async-sema',
          extended: 'Semaphore using `async` and `await`',
          dt: '2019-09-21T16:47:07Z',
          tags: [
            'github-starred',
            'async',
            'asynchronous',
            'await',
            'package',
            'semaphore',
          ].join(','),
        })
      ).toMatchSnapshot();
    });
  });
});
