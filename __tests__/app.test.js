process.env.NODE_ENV = "test";
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
        expect(reviews).toBeSortedBy("created_at", { descending: true });
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              category: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              comment_count: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("200: accepts category query and returns only reviews with a matching category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(1);
      });
  });
  test("200: accepts sort_by and order queries and returns ordered results", () => {
    return request(app)
      .get("/api/reviews?sort_by=category&order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("category");
      });
  });
  test("200: accepts category query and returns only reviews with a matching category, sorted by defined field (default DESC)", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=title")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(11);
        expect(reviews).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: valid category but no reviews returns an empty array", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(0);
      });
  });
  test("400 invalid sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400 invalid order query", () => {
    return request(app)
      .get("/api/reviews?order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 non-existent category", () => {
    return request(app)
      .get("/api/reviews?category=invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET api/reviews/:review_id", () => {
  test("200: should return an object with the key of review and a review object as a value including a comment count", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body: review }) => {
        expect(review.review).toMatchObject({
          review_id: 3,
          title: "Ultimate Werewolf",
          category: "social deduction",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_body: "We couldn't find the werewolf!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
          comment_count: "3",
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
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
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
  test("201: should respond with the posted comment as an object and ignore additional key-values in the object", () => {
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
      body: "some body text",
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

describe("PATCH /api/reviews/:review_id", () => {
  test("200 created adds the correct number of votes to the review", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVote)
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review.votes).toBe(6);
      });
  });
  test("400: Bad request when required key is missing", () => {
    const newVote = {};
    return request(app)
      .patch("/api/reviews/2")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Not found when supplied id is valid but does not exist", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/1000")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400 Bad request when supplied vote is invalid", () => {
    const newVote = { inc_votes: "invalid" };
    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200 should receive an object with the key of users and an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: users }) => {
        expect(users.users).toHaveLength(4);
        users.users.forEach((user) => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
