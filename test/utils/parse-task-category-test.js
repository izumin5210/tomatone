/* @flow */
import parseTaskCategory from "../../src/utils/parse-task-category";

describe("parseTaskCategory()", () => {
  let title: string;

  context("when a title has no category names", () => {
    beforeEach(() => {
      title = "awesome task";
    });

    it("returns a categoryName and a taskTitle", () => {
      const { taskTitle, categoryNames } = parseTaskCategory(title);
      assert(taskTitle === "awesome task");
      assert(categoryNames.length === 0);
    });
  });

  context("when a title has a non-nested category name", () => {
    beforeEach(() => {
      title = "root test category/awesome task";
    });

    it("returns a categoryName and a taskTitle", () => {
      const { taskTitle, categoryNames } = parseTaskCategory(title);
      assert(taskTitle === "awesome task");
      assert(categoryNames.length === 1);
      assert(categoryNames[0] === "root test category");
    });
  });

  context("when a title has a nested category name", () => {
    beforeEach(() => {
      title = "root test category/nested test category/awesome task";
    });

    it("returns a categoryName and a taskTitle", () => {
      const { taskTitle, categoryNames } = parseTaskCategory(title);
      assert(taskTitle === "awesome task");
      assert(categoryNames.length === 2);
      assert(categoryNames[0] === "root test category");
      assert(categoryNames[1] === "nested test category");
    });
  });
});
