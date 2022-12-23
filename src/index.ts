// Dependencies
import express from "express";
import routes from "./routes";
import { Result } from "@merchandi/dmp-core-common-classes";

// Service
const service: any = express();

// Default global middleware
service.use(express.json()); // Parse body for POST
service.use(express.urlencoded({ extended: true })); // Parse body for PUT

// Load routes
for (let i = 0; i < routes.length; i++) {
  // Get route
  const route: any = routes[i];

  // Set method
  service[route.method ?? "get"](
    // Set path
    route.path,

    // Set middleware
    ...(route.middleware ?? []),
    async (request: any, response: any) => {
      // Create service result
      const serviceResult = new Result();

      // Try to solve it
      try {
        // Set route routeHandler
        const {
          success,
          data: { events = [], ...resultData },
          errors,
        } = await route.routeHandler({
          data: request.requestData,
          request,
          response,
        });

        // Set result
        serviceResult.success = success;
        serviceResult.data = resultData;
        serviceResult.errors.push(...errors);

        // Set events
        request.eventsToSend = events;
      } catch (error: any) {
        // If any error push error
        serviceResult.errors.push("Unknown error");
        serviceResult.errors.push(error);
        console.error(error);
      }

      // Return service result
      return response.send(serviceResult);
    }
  );
}

// Export service
export default service;
