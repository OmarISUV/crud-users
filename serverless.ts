// Load env variables
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

// Set observability
const OBSERVABILITY =
  (process.env.SVC_OBSERVABILITY as string) == "true" ? true : false;

// Define serverless configuration
let config: any = {};

// Service
config.service = process.env.SVC_NAME;

// Provider
config.provider = {
  name: "aws",
  stage: process.env.SVC_STAGE as string,
  runtime: "nodejs14.x",
  timeout: Number(process.env.SVC_TIMEOUT as string),
  deploymentMethod: "direct",
  // Observability
  tracing: {
    apiGateway: OBSERVABILITY,
    lambda: OBSERVABILITY,
  },
  httpApi: {
    metrics: OBSERVABILITY,
  },
};

// Package
config.package = {
  patterns: ["!**", "node_modules/**", "dist/**", ".env"],
};

// Function to deploy
config.functions = {
  service: {
    handler: "dist/handler.handler",
    events: [
      {
        httpApi: "*",
      },
    ],
  },
};

// Export serverless configuration
module.exports = config;
