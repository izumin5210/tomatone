/* @flow */
import { mount } from "enzyme";
import { spy }   from "sinon";

import { StaticRouter } from "react-router";
import { Map }          from "immutable";

import {
  Category,
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

describe("<CategoryList />", () => {
  let wrapper;

  let categories: Map<number, Category>;
  let taskCounts: Map<number, number>;
  let closeSpy: spy;
  let props: Props;

  beforeEach(() => {
    let id = 0;
    categories = Map([
      [Category.ALL.id, Category.ALL],
      [Category.NO_CATEGORY.id, Category.NO_CATEGORY],
      [(id += 1), new Category({ id, name: "category1" })],
      [(id += 1), new Category({ id, name: "category1/category2" })],
      [(id += 1), new Category({ id, name: "category1/category3" })],
      [(id += 1), new Category({ id, name: "category1/category2/category4" })],
      [(id += 1), new Category({ id, name: "alt-category" })],
    ]);
    id = 0;
    taskCounts = Map([
      [Category.ALL.id, 4],
      [Category.NO_CATEGORY.id, 1],
      [1, 2],
      [3, 1],
    ]);
    closeSpy = spy();
    props = {
      currentCategory: categories.get(1),
      categories,
      taskCounts,
      close:           closeSpy,
      depth:           1,
    };
    wrapper = createWrapper(props);
  });

  describe("render valid category list", () => {
    let items;

    beforeEach(() => {
      items = wrapper.find(".CategoryList_root > CategoryNode");
    });

    it("has 6 nodes", () => {
      assert(wrapper.find("CategoryNode").length === 6);
    });

    it("has 4 nodes directly under root", () => {
      assert(items.length === 4);
    });

    it("renders nodes alphabetically", () => {
      assert(items.at(0).props().category.id === Category.ALL.id);
      assert(items.at(1).props().category.id === Category.NO_CATEGORY.id);
      assert(items.at(2).props().category.id === 5);
      assert(items.at(3).props().category.id === 1);
    });

    context("category1", () => {
      let item;

      beforeEach(() => {
        item = items.at(3);
      });

      it("is received 3 child categories", () => {
        assert(item.props().children.props.categories.size === 3);
      });

      it("is received depth 2", () => {
        assert(item.props().children.props.depth === 2);
      });
    });

    context("alt-category", () => {
      let item;

      beforeEach(() => {
        item = items.at(2);
      });

      it("is received children is null", () => {
        assert(item.props().children == null);
      });
    });
  });
});

