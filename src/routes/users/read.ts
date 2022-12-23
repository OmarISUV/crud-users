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
  page: {
    optional: true,
    isInt: true,
    toInt: true,
  },
  pageSize: {
    optional: true,
    isInt: true,
    toInt: true,
  },
  search: {
    optional: true,

    isLength: {
      errorMessage: "Should be at least 1 char/s long and no more than 250.",
      options: { min: 1, max: 250 },
    },
  },
};

/**
 * Default delete route
 */
const readRoute = {
  method: "get",
  path: "/users",
  middleware: [checkSchema(validations), getRequestData],
  routeHandler: async (options: any) => {
    // Extract data
    const { userWithSameUUID } = options.request;
    const { page = 1, pageSize = 12, search } = options.data;

    // Get all users if not request for specific user
    let skip = (page -1)* pageSize
    let limit =  pageSize
    let users: any = [];
    let filter: any = {};
    let projection: any = {
      _id: false,
      uuid: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      last_login_at: true,
      created_at: true,
      updated_at: true,
    };
    let countTotal = 0;
    
    if (!userWithSameUUID) {
      if (search) filter = { email: {$regex : new RegExp(`${search}`, 'i')} };

      // Find
      let usersCursors = await usersCollection
        .find(filter, { projection })
        .skip(skip)
        .limit(limit);
      // @ts-ignore
      countTotal = await usersCollection.countDocuments(filter);
      users = await usersCursors.toArray();
    }

    // Create result
    const handlerResult = new Result({
      success: true,
      data: {
        users,
        user: userWithSameUUID,
        maxPage: Math.ceil(countTotal / pageSize) ,
        //countWithConstraints,
        message: `Hello from service ${SVC_NAME}`,
      },
    });

    // return result
    return handlerResult;
  },
};

export default readRoute;
