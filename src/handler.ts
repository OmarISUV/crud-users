import serverlessExpress from "@vendia/serverless-express";
import service from ".";

// Wrap service
const handler = serverlessExpress({ app: service });

// Export handler
export { handler };
