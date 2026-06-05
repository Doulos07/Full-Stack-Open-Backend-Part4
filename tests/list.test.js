const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const result = listHelper.dummy();
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });
});

describe("favoriteBlog", () => {
  const favorite = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12,
  };

  const blogs = [
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      likes: 7,
    },
    {
      title: "Refactoring UI",
      author: "Martin Fowler",
      likes: 10,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
  ];

  test("returns blog with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    console.log("result", result);

    assert.deepStrictEqual(favorite, result);
  });
});
