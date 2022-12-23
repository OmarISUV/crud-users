import service from ".";
import { SVC_NAME, SVC_PORT } from "./config";

// Service Listen
service.listen(SVC_PORT, () =>
  console.log(`Service ${SVC_NAME} listening at: http://localhost:${SVC_PORT}`)
);
