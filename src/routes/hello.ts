import { Result } from "@merchandi/dmp-core-common-classes";
import { getRequestData, sendEvents } from "../middleware";
import { SVC_NAME } from "../config";

/**
 * Default hello route
 */
const helloRoute = {
  path: "/",
  middleware: [getRequestData, sendEvents],
  routeHandler: async () => {
    // Create result
    const handlerResult = new Result({
      success: true,
      data: {
        message: `Hello from service ${SVC_NAME}`,
      },
    });

    // Send
    return handlerResult;
  },
};

export default helloRoute;
