import { main } from '.';

describe('CLI', () => {
  it('processes 4 total items from 2 pages with a page size of 2', async () => {
    const result = await main({
      githubAccessToken: process.env.GITHUB_ACCESS_TOKEN as string,
      pinboardAPIToken: process.env.PINBOARD_API_TOKEN as string,
      paginationPageLimit: 2,
      perPage: 2,
      disableConfig: true,
    });
    expect(result).toMatchSnapshot();
    expect(result.length).toEqual(4);
  });
});
