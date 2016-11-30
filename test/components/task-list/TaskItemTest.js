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
      onCheck:  spy(),
      onSelect: spy(),
      onUpdate: spy(),
      delete:   spy(),
      selected: false,
    };
  });

  describe("completeTask", () => {
    it("calls onCheck() when an icon is clicked", () => {
      const wrapper = shallow(<TaskItem {...props} />);
      assert(!props.onCheck.called);
      wrapper.find(".TaskList__complete")
        .simulate("change", { target: { value: true } });
      assert(props.onCheck.calledOnce);
    });
  });

  describe("selectTask", () => {
    it("calls onSelect() when an item body is clicked", () => {
      const wrapper = shallow(<TaskItem {...props} />);
      assert(!props.onSelect.called);
      wrapper.find(".TaskList__select")
        .simulate("change", { target: { value: true } });
      assert(props.onSelect.calledOnce);
    });
  });

  describe("updateTask", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<TaskItem {...props} />);
      assert(!props.onUpdate.called);
      assert(wrapper.find(".TaskList__form-edit").length === 0);
      wrapper.find(".TaskList__btn-edit").simulate("click");
      assert(wrapper.find(".TaskList__form-edit").length === 1);
    });

    it("calls onUpdate() when btn-edit is clicked", () => {
      wrapper.find(".TaskList__input-title")
        .simulate("change", { target: { value: "changed title" } });
      wrapper.find(".TaskList__btn-edit").simulate("click");
      assert(props.onUpdate.calledOnce);
      assert(props.onUpdate.args[0][0].title === "changed title");
    });

    it("calls onUpdate() when form-edit is submitted", () => {
      wrapper.find(".TaskList__input-title")
        .simulate("change", { target: { value: "changed title" } });
      wrapper.find(".TaskList__form-edit").simulate("submit");
      assert(props.onUpdate.calledOnce);
      assert(props.onUpdate.args[0][0].title === "changed title");
    });

    it("does not calls onUpdate() when the form content is not changed and btn-edit is clicked", () => {
      wrapper.find(".TaskList__btn-edit").simulate("click");
      assert(!props.onUpdate.called);
      assert(wrapper.find(".TaskList__form-edit").length === 0);
    });
  });

  describe("deleteTask", () => {
    it("calls delete() when btn-delete is clicked", () => {
      const wrapper = shallow(<TaskItem {...props} />);
      assert(!props.delete.called);
      assert(wrapper.find(".TaskList__btn-delete").length === 0);
      wrapper.find(".TaskList__btn-edit").simulate("click");
      assert(wrapper.find(".TaskList__btn-delete").length === 1);
      wrapper.find(".TaskList__btn-delete").simulate("click");
      assert(props.delete.calledOnce);
    });
  });

  describe("clearTitle", () => {
    it("clears the title and disable editing mode", () => {
      const wrapper = shallow(<TaskItem {...props} />);
      assert(wrapper.find(".TaskList__btn-clear").length === 0);
      wrapper.find(".TaskList__btn-edit").simulate("click");
      assert(wrapper.find(".TaskList__btn-clear").length === 1);
      wrapper.find(".TaskList__input-title")
        .simulate("change", { target: { value: "changed title" } });
      wrapper.find(".TaskList__btn-clear").simulate("click", { preventDefault: spy() });
      assert(wrapper.find(".TaskList__input-title").length === 0);
      assert(!wrapper.state().editing);
      assert(wrapper.state().title === props.task.title);
    });
  });
});
