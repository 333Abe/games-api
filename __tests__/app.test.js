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

describe("GET api/reviews", () => {
  test("should return an object with the key of reviews and an array of review objects as a value", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        reviews.forEach((review) => {
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            comment_count: expect.any(Number),
            review_img_url: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(Date),
          });
        });
      });
  });
});
