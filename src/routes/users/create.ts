import { Result } from "@merchandi/dmp-core-common-classes";
import { getRequestData, sendEvents } from "../../middleware";
import { SVC_NAME, mongoClient } from "../../config";
import { checkSchema } from "express-validator";
import { v4 as uuidv4 } from "uuid";

/**
 * Collections
 */

const usersCollection = mongoClient.db("resources").collection("api_users");

/**
 * Validation schema
 * https://express-validator.github.io/docs/schema-validation.html
 */

const validations: any = {
  name: {
    optional: true,

    isLength: {
      errorMessage: "Should be at least 1 char/s long and no more than 250.",
      options: { min: 1, max: 250 },
    },
  },
  email: {
    optional: false,

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
 * Default create route
 */
const createRoute = {
  method: "post",
  path: "/users",
  middleware: [checkSchema(validations), getRequestData, sendEvents],
  routeHandler: async (options: any) => {
    // Extract data
    const { name, email, image, phone, last_login_at } = options.data;

    // Define new user
    const user = {
      uuid: uuidv4(),
      name,
      email,
      image,
      phone,
      last_login_at,
      created_at: new Date().toISOString(),
      updated_at: null,
    };

    // Insert new user
    const confirmation = await usersCollection.insertOne(user);

    // Define events
    const events = [
      {
        kafka: true,
        topic: "resources-users-created",
        data: user,
      },
      {
        pusher: true,
        channel: "resources",
        event: "users-created",
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

export default createRoute;
