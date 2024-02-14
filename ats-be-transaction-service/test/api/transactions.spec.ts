/** @format */

import { app } from "../../src/app";
import request from "supertest";

const commonHeaders = {
  ["X-Auth-User"]: '{"accountId": "GB14TBOL04297400000049"}',
};

describe("GET /api/transactions", () => {
  test("should return all transactions", async () => {
    const res = await request(app)
      .get("/api/transactions")
      .set(commonHeaders)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual("new transactions");
  });
});
