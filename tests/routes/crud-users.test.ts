import request from "supertest";
import service from "../../src";
import { v4 as uuidv4 } from "uuid";

describe("Basic CRUD resource user", () => {
  // Default
  let user: any = null;

  test("Create user", async () => {
    // Define create user
    const requestData = {
      name: "name" + uuidv4(),
      email: uuidv4()+"@email.com",
      image: "image" + uuidv4(),
      phone: "phone" + uuidv4(),
      last_login_at: new Date().toISOString(),
    };

    // Make request
    const response = await request(service).post("/users").send(requestData);

    // Expect request to past
    expect(response.statusCode).toBe(200);

    // Get result
    const result = response.body;

    // Expect result to be successful
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);

    // Same user
    expect(result.data.user.email).toBe(requestData.email);

    // DB confirmation
    expect(result.data.confirmation.acknowledged).toBe(true);

    // Set user
    user = result.data.user;
  });

  test("Read users", async () => {
    // Define delete user
    const requestData = {
      uuid: user.uuid,
    };

    // Make request
    const responseOne = await request(service).get("/users").send(requestData);
    const responseMany = await request(service).get("/users");

    // Expect request to past
    expect(responseOne.statusCode).toBe(200);
    expect(responseMany.statusCode).toBe(200);

    // Get result
    const resultOne = responseOne.body;
    const resultMany = responseMany.body;

    // Expect result to be successful
    expect(resultOne.success).toBe(true);
    expect(resultOne.errors).toHaveLength(0);
    expect(resultMany.success).toBe(true);
    expect(resultMany.errors).toHaveLength(0);

    // Check data
    expect(resultOne.data.user.uuid).toBe(requestData.uuid);
    expect(resultMany.data.users.length).toBeGreaterThan(0);
  });

  test("Update user", async () => {
    // Define update user
    const requestData = {
      uuid: user.uuid,
      name: "name" + uuidv4(),
      email: uuidv4()+"@email.com",
      image: "image" + uuidv4(),
      phone: "phone" + uuidv4(),
      last_login_at: new Date().toISOString(),
    };

    // Make request
    const response = await request(service).put("/users").send(requestData);

    // Expect request to past
    expect(response.statusCode).toBe(200);

    // Get result
    const result = response.body;

    // Expect result to be successful
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);

    // Same user
    expect(result.data.user.uuid).toBe(requestData.uuid);
    expect(result.data.user.email).toBe(requestData.email);

    // DB confirmation
    expect(result.data.confirmation.lastErrorObject.updatedExisting).toBe(true);

    // Set user
    user = result.data.user;
  });

  test("Delete user", async () => {
    // Define delete user
    const requestData = {
      uuid: user.uuid,
    };

    // Make request
    const response = await request(service).delete("/users").send(requestData);

    // Expect request to past
    expect(response.statusCode).toBe(200);

    // Get result
    const result = response.body;

    // Expect result to be successful
    expect(result.success).toBe(true);

    // Expect 0 errors
    expect(result.errors).toHaveLength(0);

    // DB confirmation
    expect(result.data.confirmation.DBconfirmation.acknowledged).toBe(true);

    // Delete only one
    expect(result.data.confirmation.DBconfirmation.deletedCount).toBe(1);

    // DB delete confirmation
    expect(result.data.confirmation.DBconfirmationMoved.acknowledged).toBe(
      true
    );
  });
});
