"use strict";

const Fastify = require("fastify");
const mercurius = require("mercurius");
const { DateTime } = require("luxon");
const { GraphQLScalarType, Kind } = require("graphql");

const app = async (fastify, opts) => {
  const schema = `
  scalar DateTime

  type Query {
    testDateTime(date: DateTime!): String!
  }
  `;

  const resolvers = {
    DateTime: new GraphQLScalarType({
      name: "DateTime",
      description:
        "An ISO8601 formatted date time string (e.g. 2023-02-01T08:30:00Z), parsed into a Luxon DateTime",
      serialize(value) {
        if (value instanceof DateTime) {
          return value.toISO();
        }
        throw new Error("DateTime must be a Luxon DateTime");
      },
      parseValue(dateTime) {
        return DateTime.fromISO(dateTime, { zone: "utc" });
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
          return DateTime.fromISO(ast.value, { zone: "utc" });
        }
      },
    }),
    Query: {
      testDateTime(_root, { date }) {
        return date.toFormat("MMM dd, yyyy");
      },
    },
  };

  await fastify.register(mercurius, {
    schema,
    resolvers,
    jit: true,
    graphiql: true,
  });
};

module.exports = app;
