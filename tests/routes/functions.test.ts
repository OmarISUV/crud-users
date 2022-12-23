import request from "supertest";
import service from "../../src";

describe("Functions Palindrome and Bubble Sort", () => {
  test("Test palindrome route", async () => {
     // Define phrase
     const requestData = {
        palindromo: "A man, a plan, a canal – Panama!"
      };
  
      // Make request
      const response = await request(service).post("/palindromo").send(requestData);
  
      // Expect request to past
      expect(response.statusCode).toBe(200);
  
      // Get result
      const result = response.body;
  
      // Expect result to be successful
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
  });

  test("Test bubble route", async () => {
    // Define phrase
    const requestData = {
       arrayNumber: [32,21,7,89,56,909,109]
     };
 
     // Make request
     const response = await request(service).post("/bubble").send(requestData);
 
     // Expect request to past
     expect(response.statusCode).toBe(200);
 
     // Get result
     const result = response.body;
 
     // Expect result to be successful
     expect(result.success).toBe(true);
     expect(result.errors).toHaveLength(0);
 });
});
