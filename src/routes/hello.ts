import { Result } from "@merchandi/dmp-core-common-classes";
import { getRequestData } from "../middleware";
import { SVC_NAME } from "../config";

/**
 * Default hello route
 */
const helloRoute = {
  path: "/",
  middleware: [getRequestData],
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
