import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { MongoClient } from "mongodb";
import { Kafka } from "@upstash/kafka";
import Pusher from "pusher";

// Load env
dotenv.config();

// Service variables
const SVC_NAME = process.env.SVC_NAME;
const SVC_STAGE = process.env.SVC_STAGE;
const SVC_PORT = process.env.SVC_PORT;

// Set mongodb client
const mongoClient = new MongoClient(process.env.MONGO_DB_URL as string);

// Set kafka client
const kafkaClient = new Kafka({
  url: process.env.UPSTASH_KAFKA_REST_URL as string,
  username: process.env.UPSTASH_KAFKA_REST_USERNAME as string,
  password: process.env.UPSTASH_KAFKA_REST_PASSWORD as string,
});

// Set pusher client
const pusherClient = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: false,
});

export {
  SVC_NAME,
  SVC_STAGE,
  SVC_PORT,
  mongoClient,
  kafkaClient,
  pusherClient,
};
