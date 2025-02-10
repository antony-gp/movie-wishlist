import { Client } from "@elastic/elasticsearch";

export const INDEXES = {
  ERROR: "error",
  MOVIES: "movies",
};

export const elasticClient = new Client({
  node: `http://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
});
