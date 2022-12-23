// Import all routes
import createUsersRoute from "./users/create";
import readUsersRoute from "./users/read";
import updateUsersRoute from "./users/update";
import deleteUsersRoute from "./users/delete";
import helloRoute from "./hello";
import palindromeRoute from "./functions/palindrome";
import bubbleRoute from "./functions/bubble";

const routes = [
  // Add routes
  createUsersRoute,
  readUsersRoute,
  updateUsersRoute,
  deleteUsersRoute,
  helloRoute,
  palindromeRoute,
  bubbleRoute
];

// Export all routes
export default routes;
