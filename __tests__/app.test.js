const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("404 tests for each end point", () => {
  test("404: not found when no valid end point is provided", () => {
    return request(app)
      .get("/invlaid_endpoint")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
  test("404: not found when no valid end point is provided after /api/", () => {
    return request(app)
      .get("/api/invlaid_endpoint")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
  test("404: not found when no valid end point is provided after /api/categories", () => {
    return request(app)
      .get("/api/categories/invlaid_endpoint")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
});

describe("GET api/categories", () => {
  test("should return an object with the key of categories and an array of category objects as a value", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
