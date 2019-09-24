# Github Stars to Pinboard ![Tests Status](https://github.com/aortbals/github-stars-to-pinboard/workflows/Tests/badge.svg)

`github-stars-to-pinboard` is a command line utility for syncing GitHub starred repos to Pinboard.

![github-stars-to-pinboard CLI Usage](media/github-stars-to-pinboard.gif)

## Features

- Mirrors as much metadata as possible from GitHub to Pinboard
  - Repo Name
  - Repo Description
  - The Pinboard bookmark time reflects the same time the user starred the repo
  - Mirrors repo topics to Pinboard tags and includes a default tag of `github-starred`
- Pagination support for iteration through starred repos
- Smart rate limits to prevent 429s
- Tracks last seen starred repos for fast subsequent runs (designed for cron, or similar)

## Usage

To use `github-stars-to-pinboard`, download a [release](https://github.com/aortbals/github-stars-to-pinboard/releases) build for your OS distribution. These are standalone binaries that do not require Node.js or NPM.

`github-stars-to-pinboard` requires two environment variables. Ensure these are available in the environment you plan on running the script. [`dotenv`](https://github.com/motdotla/dotenv) is also supported. Create a GitHub [personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) with `read:user` permissions. Your Pinboard API token is available [here](https://pinboard.in/settings/password).

```
GITHUB_ACCESS_TOKEN=xxxxxx
PINBOARD_API_TOKEN=xxxxxx
```

Run it:

```shell
./github-stars-to-pinboard
```

Run it daily as a cronjob, outputting the logs to a file:

```shell
@daily bin/github-stars-to-pinboard >> logs/github-stars-to-pinboard.log 2>&1
```

### Config file

`github-stars-to-pinboard` writes a `.gstp-config` file to your home directory. This file tracks the last starred repos that we're processed.

## Development

Install the dependencies:

```shell
yarn
```

Run the tests:

```shell
yarn test
```

Run the CLI locally:

```shell
yarn dev
```
