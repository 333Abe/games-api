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
          });
        });
      });
  });
});

describe("GET api/reviews/:review_id", () => {
  test("200: should return an object with the key of review and a review object as a value", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body: review }) => {
        [review].forEach((review) => {
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(Date),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("400: Bad request when supplied id is invalid", () => {
    return request(app)
      .get("/api/reviews/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Not found when supplied id is valid but does not exist", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: should respond with an array of comments with supplied review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(3);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            review_id: expect.any(Number),
            created_at: expect.any(Date),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("200: should respond with an empty array when given a valid review_id but there are no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("400: Bad request when supplied id is invalid", () => {
    return request(app)
      .get("/api/reviews/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Not found when supplied id is valid but does not exist", () => {
    return request(app)
      .get("/api/reviews/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: should respond with the posted comment as an object", () => {
    const newComment = {
      author: "mallionaire",
      body: "some body text",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: comment }) => {
        expect(comment).toMatchObject({
          comment: {
            comment_id: 7,
            body: "some body text",
            review_id: 1,
            author: "mallionaire",
            votes: 0,
          },
        });
      });
  });
  test.only("201: should respond with the posted comment as an object and ignore additional key-values in the object", () => {
    const newComment = {
      author: "mallionaire",
      body: "some body text",
      not_needed: "not wanted",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: comment }) => {
        expect(comment).toMatchObject({
          comment: {
            comment_id: 7,
            body: "some body text",
            review_id: 1,
            author: "mallionaire",
            votes: 0,
          },
        });
      });
  });
  test("400: Bad request when a required key is missing", () => {
    const newComment = {
      body: "some body text",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Bad request when review_id is invalid", () => {
    const newComment = {
      author: "mallionaire",
    };
    return request(app)
      .post("/api/reviews/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 Not found when given a valid review_id but no review exists", () => {
    const newComment = {
      author: "mallionaire",
      body: "some body text",
    };
    return request(app)
      .post("/api/reviews/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("404 Not found when username of author doesnt exist", () => {
    const newComment = {
      author: "Adrian",
      body: "some body text",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
