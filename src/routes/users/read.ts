import { Result } from "@merchandi/dmp-core-common-classes";
import { getRequestData, sendEvents } from "../../middleware";
import { SVC_NAME, mongoClient } from "../../config";
import { checkSchema } from "express-validator";

/**
 * Collections
 */

const usersCollection = mongoClient.db("resources").collection("api_users");

/**
 * Validation schema
 * https://express-validator.github.io/docs/schema-validation.html
 */

const validations: any = {
  uuid: {
    optional: true,
    isUUID: {
      errorMessage: "Should be a valid UUID",
    },
    custom: {
      errorMessage: "No documents exist with the 'uuid' provided.",
      options: async (uuid: any, { req }: any) => {
        const userWithSameUUID = await usersCollection.findOne({ uuid });
        if (userWithSameUUID) {
          // Set user found
          req.userWithSameUUID = userWithSameUUID;
          return true;
        }
        throw new Error("No documents exist with same UUID");
      },
    },
  },
};

/**
 * Default delete route
 */
const readRoute = {
  method: "get",
  path: "/users",
  middleware: [checkSchema(validations), getRequestData, sendEvents],
  routeHandler: async (options: any) => {
    // Extract data
    const { userWithSameUUID } = options.request;

    // Get all users if not request for specific user
    let users: any = [];

    if (!userWithSameUUID) {
      // Find
      const usersCursors = await usersCollection.find(
        {},
        {
          projection: {
            _id: false,
            uuid: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            last_login_at: true,

            created_at: true,
            updated_at: true,
          },
        }
      );

      users = await usersCursors.toArray();
    }

    // Create result
    const handlerResult = new Result({
      success: true,
      data: {
        users,
        user: userWithSameUUID,
        message: `Hello from service ${SVC_NAME}`,
      },
    });

    // return result
    return handlerResult;
  },
};

export default readRoute;
