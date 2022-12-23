import { Result } from "@merchandi/dmp-core-common-classes";
import { getRequestData, sendEvents } from "../../middleware";
import { SVC_NAME, mongoClient } from "../../config";
import { checkSchema } from "express-validator";

/**
 * Collections
 */

const usersCollection = mongoClient.db("resources").collection("api_users");
const usersDeletedCollection = mongoClient
  .db("resources_deleted")
  .collection("api_users");

/**
 * Validation schema
 * https://express-validator.github.io/docs/schema-validation.html
 */

const validations: any = {
  uuid: {
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
const deleteRoute = {
  method: "delete",
  path: "/users",
  middleware: [checkSchema(validations), getRequestData, sendEvents],
  routeHandler: async (options: any) => {
    // Extract data
    const { userWithSameUUID } = options.request;

    // Move resource
    const DBconfirmationMoved = await usersDeletedCollection.insertOne({
      ...userWithSameUUID,
      deleted_at: new Date().toISOString(),
    });

    // Delete from main database
    const DBconfirmation = await usersCollection.deleteOne({
      uuid: userWithSameUUID.uuid,
    });

    // Define events
    const events = [
      {
        kafka: true,
        topic: "resources-users-created",
        data: userWithSameUUID,
      },
      {
        pusher: true,
        channel: "resources",
        event: "users-created",
        data: userWithSameUUID,
      },
    ];

    // Create result
    const handlerResult = new Result({
      success: true,
      data: {
        confirmation: {
          DBconfirmation,
          DBconfirmationMoved,
        },
        events,
        message: `Hello from service ${SVC_NAME}`,
      },
    });

    // return result
    return handlerResult;
  },
};

export default deleteRoute;
