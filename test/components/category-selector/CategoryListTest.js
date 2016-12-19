/* @flow */
import { mount } from "enzyme";
import { spy }   from "sinon";

import { StaticRouter } from "react-router";
import { Map }          from "immutable";

import {
  Category,
  Task,
} from "../../../src/entities";

/* eslint-disable no-duplicate-imports */
import CategoryList   from "../../../src/components/category-selector/CategoryList";
import type { Props } from "../../../src/components/category-selector/CategoryList";
/* eslint-enable */

function createWrapper(props: Props) {
  // https://github.com/ReactTraining/react-router/blob/553b56a750072641b532c1113336a706d6f62648/modules/__tests__/Link-test.js#L259-L277
  return mount((
    <StaticRouter
      location="/"
      action="POP"
      onPush={() => {}}
      onReplace={() => {}}
    >
      <CategoryList {...props} />
    </StaticRouter>
  ));
}

function hasUrlAsHref(htmlAsString, url: string) {
  return htmlAsString.indexOf(`href="${url}"`) !== -1;
}

describe("<CategoryBreadcrumbs />", () => {
  let wrapper;

  let categories: Map<number, Category>;
  let tasks: Map<number, Task>;
  let closeSpy: spy;
  let props: Props;

  beforeEach(() => {
    let id = 0;
    categories = Map([
      [Category.ALL.id, Category.ALL],
      [Category.NO_CATEGORY.id, Category.NO_CATEGORY],
      [(id += 1), new Category({ id, name: "category1" })],
      [(id += 1), new Category({ id, name: "category2" })],
      [(id += 1), new Category({ id, name: "category1/category3" })],
      [(id += 1), new Category({ id, name: "alt-category" })],
    ]);
    id = 0;
    tasks = Map([
      [(id += 1), new Task({ id, title: "task1", categoryId: 1 })],
      [(id += 1), new Task({ id, title: "task2", categoryId: 1 })],
      [(id += 1), new Task({ id, title: "task3", categoryId: 3 })],
      [(id += 1), new Task({ id, title: "task4" })],
    ]);
    closeSpy = spy();
    props = {
      categories,
      tasks,
      close: closeSpy,
    };
    wrapper = createWrapper(props);
  });

  it("calls props.close when a list item is clicked", () => {
    const item = wrapper.find(".CategoryList__item a").at(2);
    assert(!closeSpy.called);
    item.simulate("click");
    assert(closeSpy.calledOnce);
  });

  describe("render valid category list", () => {
    let items;

    beforeEach(() => {
      items = wrapper.find(".CategoryList__item");
    });

    it("has 6 categories", () => {
      assert(items.length === 6);
    });

    it("renders categories alphabetically", () => {
      assert(items.at(2).find(".CategoryList__item-name").text() === "alt-category");
    });

    context("ALL TASKS", () => {
      let item;

      beforeEach(() => {
        item = items.at(0);
      });

      it("has valid link", () => {
        assert(hasUrlAsHref(item.find("a").html(), "/tasks"));
      });

      it("has valid item name", () => {
        assert(item.find(".CategoryList__item-name").text() === Category.ALL.name);
      });

      it("has valid item count", () => {
        assert(item.find(".CategoryList__item-count").text() === "4");
      });
    });

    context("when NO CATEGORY", () => {
      let item;

      beforeEach(() => {
        item = items.at(1);
      });

      it("has valid link", () => {
        assert(hasUrlAsHref(item.find("a").html(), "/tasks?category=%2F"));
      });

      it("has valid item name", () => {
        assert(item.find(".CategoryList__item-name").text() === Category.NO_CATEGORY.name);
      });

      it("has valid item count", () => {
        assert(item.find(".CategoryList__item-count").text() === "1");
      });
    });

    context("when the category has 2 tasks", () => {
      let item;

      beforeEach(() => {
        item = items.at(3);
      });

      it("has valid link", () => {
        assert(hasUrlAsHref(item.find("a").html(), "/tasks?category=%2Fcategory1"));
      });

      it("has valid item name", () => {
        assert(item.find(".CategoryList__item-name").text() === "category1");
      });

      it("has valid item count", () => {
        assert(item.find(".CategoryList__item-count").text() === "2");
      });
    });

    context("when the category's depth is 2", () => {
      let item;

      beforeEach(() => {
        item = items.at(4);
      });

      it("has valid link", () => {
        assert(hasUrlAsHref(item.find("a").html(), "/tasks?category=%2Fcategory1%2Fcategory3"));
      });

      it("has valid item name", () => {
        assert(item.find(".CategoryList__item-name").text() === "category1/category3");
      });

      it("has valid item count", () => {
        assert(item.find(".CategoryList__item-count").text() === "1");
      });
    });

    context("when the category has no tasks", () => {
      let item;

      beforeEach(() => {
        item = items.at(5);
      });

      it("has valid link", () => {
        assert(hasUrlAsHref(item.find("a").html(), "/tasks?category=%2Fcategory2"));
      });

      it("has valid item name", () => {
        assert(item.find(".CategoryList__item-name").text() === "category2");
      });

      it("has valid item count", () => {
        assert(item.find(".CategoryList__item-count").text() === "0");
      });
    });
  });
});

