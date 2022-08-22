GitHub Dashboard
================

> A web app which displays open pull requests of an organisation with customisable filters.


Installation
------------

The easiest way to run the dashboard is by using Docker:

```
docker run \
    -e GITHUB_ORG=my-org \
    -e GITHUB_TOKEN=my-api-token \
    -e FILTERS=/app/conf/filters.json \
    -v $PWD/filters.json:/app/conf/filters.json \
    -p 8080:8080 \
    docker pull ghcr.io/ksm2/github-dashboard
```


Configuration
-------------

### Environment Variables

| **Env**        | **Description**                                                                   |
|:---------------|:----------------------------------------------------------------------------------|
| `HTTP_PORT`    | The port to run the server on, defaults to `8080`                                 |
| `GITHUB_ORG`   | The GitHub Organisation to load PRs for                                           |
| `GITHUB_TOKEN` | The auth token to use when connecting with GitHub, [can be generated here][token] |
| `FILTERS`      | Absolute filename to the filter config JSON file, see below                       |

### Filter Config

The `filters.json` file is expected to be an array which contains a definition for a filter.
The expected format looks like this:

```json
[
  {
    // A simple filter based on the team owning a repository
    "name": "A Team",
    "query": {
      "team": { "$eq": "A Team" }
    }
  },
  {
    // A filter using the PR author's username
    "name": "Backend",
    "query": {
      "author": { "$in": ["ksm2", "username3", "auth4"] }
    }
  },
  {
    // You can also combine multiple filters using `$or`
    "name": "Backend",
    "query": {
      "$or": [
        {
          "author": { "$ni": ["ksm2", "username3", "auth4"] }
        },
        {
          "team": { "$ne": "A Team" }
        },
        {
          "title": { "$inc": "Snyk" }
        }
      ]
    }
  }
]
```

The supported queries are:

- `$eq`: The value equals the given one
- `$ne`: The value does not equal the given one
- `$in`: The value is part of the given set
- `$ni`: The value is not part of the given set
- `$inc`: The value includes the given string
- `$exc`: The value excludes the given string


[token]: https://github.com/settings/tokens/new
