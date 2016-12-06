/* @flow */

import { shallow }  from "enzyme";
import { spy }      from "sinon";

import TaskItem       from "../../../src/components/task-list/TaskItem";
/* eslint-disable no-duplicate-imports */
import type { Props } from "../../../src/components/task-list/TaskItem";
/* eslint-enable */

import {
  Task,
} from "../../../src/entities";

describe("<TaskItem />", () => {
  let props: Props;

  beforeEach(() => {
    const task = new Task({ id: 1, title: "awesome task" });
    props = {
      task,
      check:    spy(),
      select:   spy(),
      update:   spy(),
      delete:   spy(),
      selected: false,
    };
  });

  describe("completeTask", () => {
    it("calls check() when an icon is clicked", () => {
      const wrapper = shallow(<TaskItem {...props} />);
      assert(!props.check.called);
      wrapper.find(".TaskItem__complete")
        .simulate("change", { target: { value: true } });
      assert(props.check.calledOnce);
    });
  });

  describe("selectTask", () => {
    it("calls select() when an item body is clicked", () => {
      const wrapper = shallow(<TaskItem {...props} />);
      assert(!props.select.called);
      wrapper.find(".TaskItem__select")
        .simulate("change", { target: { value: true } });
      assert(props.select.calledOnce);
    });
  });
});
