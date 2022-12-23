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
  name: {
    optional: true,

    isLength: {
      errorMessage: "Should be at least 1 char/s long and no more than 250.",
      options: { min: 1, max: 250 },
    },
  },
  email: {
    optional: true,

    isEmail: true,
    
    custom: {
      errorMessage:
        "Should be unique value, there is a document with the same value for the same prop",
      options: async (value: any) => {
        const userWithSameEmail = await usersCollection.findOne({
          email: value,
        });
        if (!userWithSameEmail) return true;
        throw new Error("Is not unique value");
      },
    },
  },
  image: {
    optional: true,

    isLength: {
      errorMessage: "Should be at least 1 char/s long and no more than 250.",
      options: { min: 1, max: 250 },
    },
  },
  phone: {
    optional: true,

    isLength: {
      errorMessage: "Should be at least 1 char/s long and no more than 250.",
      options: { min: 1, max: 250 },
    },
  },
  last_login_at: {
    optional: true,

    errorMessage: "Should be a date in ISO8601 format.",
    isISO8601: true,
  },
};

/**
 * Default update route
 */
const updateRoute = {
  method: "put",
  path: "/users",
  middleware: [checkSchema(validations), getRequestData, sendEvents],
  routeHandler: async (options: any) => {
    // Extract data
    const { uuid, name, email, image, phone, last_login_at } = options.data;
    const { userWithSameUUID } = options.request;

    // Define updated user
    let user = {
      ...userWithSameUUID,
      updated_at: new Date().toISOString(),
    };

    // Add new values if exist
    if (name) user.name = name;
    if (email) user.email = email;
    if (image) user.image = image;
    if (phone) user.phone = phone;
    if (last_login_at) user.last_login_at = last_login_at;

    // Update and find user
    const { value, ...confirmation }: any =
      await usersCollection.findOneAndUpdate(
        { uuid },
        {
          $set: user,
        },
        { returnDocument: "after" }
      );

    // Set user to document data
    user = value;

    // Define events
    const events = [
      {
        kafka: true,
        topic: "resources-users-updated",
        data: user,
      },
      {
        pusher: true,
        channel: "resources",
        event: "users-updated",
        data: user,
      },
    ];

    // Create result
    const handlerResult = new Result({
      success: true,
      data: {
        user,
        confirmation,
        events,
        message: `Hello from service ${SVC_NAME}`,
      },
    });

    // return result
    return handlerResult;
  },
};

export default updateRoute;
