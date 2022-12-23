import request from "supertest";
import service from "../../src";

describe("Hello route", () => {
  test("Test hello route", async () => {
    // Make request
    const response = await request(service).get("/");

    // Expect request to past
    expect(response.statusCode).toBe(200);

    // Get result
    const result = response.body;

    // Expect result to be successful
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
