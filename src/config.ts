import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { MongoClient } from "mongodb";


// Load env
dotenv.config();

// Service variables
const SVC_NAME = process.env.SVC_NAME;
const SVC_STAGE = process.env.SVC_STAGE;
const SVC_PORT = process.env.SVC_PORT;

// Set mongodb client
const mongoClient = new MongoClient(process.env.MONGO_DB_URL as string);



export {
  SVC_NAME,
  SVC_STAGE,
  SVC_PORT,
  mongoClient,
};
