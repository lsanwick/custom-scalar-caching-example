# custom-scalar-caching-example

Demonstates an issue with query caching and JIT in Mercurius.

## Installation

`npm install && npm run dev`

## Reproduction

- Visit https://localhost:3000/graphiql
- Perform this query:

```graphql
{
  testDateTime(date: "2023-05-17T08:25:00Z")
}
```

- Observe the correct result:

```json
{
  "data": {
    "testDateTime": "May 17, 2023"
  }
}
```

- Run the query again by hitting `Ctrl-Enter`

- Observe that the query now errors like so:

```json
{
  "data": null,
  "errors": [
    {
      "message": "date.toFormat is not a function",
      "locations": [
        {
          "line": 2,
          "column": 1
        }
      ],
      "path": ["testDateTime"]
    }
  ]
}
```

- Adjust formatting or indentation of the query and run it again, and it will succeed.

- Disabling the `jit` option for Mercurius will solve the problem, as will leaving it enabled and marking `cache: false`.
