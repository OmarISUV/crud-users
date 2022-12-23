import { validationResult } from "express-validator";
import { Result } from "@merchandi/dmp-core-common-classes";

/**
 * Middleware to:
 * - Get the request data
 * - Exit if any validations fails
 * @param request
 * @param response
 * @param next
 * @returns Result
 */
const getRequestData = async (request: any, response: any, next: any) => {
  // Create service result
  const serviceResult = new Result();

  // Validate request
  const errors = validationResult(request);

  // If contains errors, exit
  if (!errors.isEmpty()) {
    serviceResult.errors.push("Validation failed");
    serviceResult.errors.push(...errors.array());
    return response.send(serviceResult);
  }

  // Get request data
  const requestData = {
    ...request.query,
    ...request.params,
    ...request.body,
  };

  // Set request data
  request.requestData = requestData;

  return next();
};

export default getRequestData;
