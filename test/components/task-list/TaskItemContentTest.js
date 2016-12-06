/* @flow */

import { mount } from "enzyme";
import { spy }   from "sinon";

import TaskItemContent from "../../../src/components/task-list/TaskItemContent";
/* eslint-disable no-duplicate-imports */
import type { Props }  from "../../../src/components/task-list/TaskItemContent";
/* eslint-enable */

import {
  Task,
} from "../../../src/entities";

describe("<TaskItemContent />", () => {
  let props: Props;
  let wrapper;
  let mockEvent;

  beforeEach(() => {
    mockEvent = { preventDefault: spy() };
    const task = new Task({ id: 1, title: "awesome task" });
    props = {
      task,
      update: spy(),
      delete: spy(),
    };
    wrapper = mount(<TaskItemContent {...props} />);
  });

  describe("updateTask", () => {
    beforeEach(() => {
      assert(!props.update.called);
      assert(wrapper.find(".TaskItemContent__form-edit").length === 0);
      wrapper.find("#TaskItemContent__button-edit").simulate("click", mockEvent);
      assert(wrapper.find(".TaskItemContent__form-edit").length === 1);
    });

    it("calls update() when btn-edit is clicked", () => {
      wrapper.find(".TaskItemContent__input-title")
        .simulate("change", { target: { value: "changed title" } });
      wrapper.find("#TaskItemContent__button-edit").simulate("click", mockEvent);
      assert(props.update.calledOnce);
      assert(props.update.args[0][0].title === "changed title");
    });

    it("calls update() when form-edit is submitted", () => {
      wrapper.find(".TaskItemContent__input-title")
        .simulate("change", { target: { value: "changed title" } });
      wrapper.find(".TaskItemContent__form-edit").simulate("submit", mockEvent);
      assert(props.update.calledOnce);
      assert(props.update.args[0][0].title === "changed title");
    });

    it("does not calls update() when the form content is not changed and btn-edit is clicked", () => {
      wrapper.find("#TaskItemContent__button-edit").simulate("click", mockEvent);
      assert(!props.update.called);
      assert(wrapper.find(".TaskItemContent__form-edit").length === 0);
    });
  });

  describe("deleteTask", () => {
    it("calls delete() when btn-delete is clicked", () => {
      assert(!props.delete.called);
      assert(wrapper.find("#TaskItemContent__button-delete").length === 0);
      wrapper.find("#TaskItemContent__button-edit").simulate("click");
      assert(wrapper.find("#TaskItemContent__button-delete").length === 1);
      wrapper.find("#TaskItemContent__button-delete").simulate("click");
      assert(props.delete.calledOnce);
    });
  });

  describe("clearTitle", () => {
    it("clears the title and disable editing mode", () => {
      assert(wrapper.find("#TaskItemContent__button-clear").length === 0);
      wrapper.find("#TaskItemContent__button-edit").simulate("click", mockEvent);
      assert(wrapper.find("#TaskItemContent__button-clear").length === 1);
      wrapper.find(".TaskItemContent__input-title")
        .simulate("change", { target: { value: "changed title" } });
      wrapper.find("#TaskItemContent__button-clear").simulate("click", mockEvent);
      assert(wrapper.find(".TaskItemContent__input-title").length === 0);
      assert(!wrapper.state().editing);
      assert(wrapper.state().title === props.task.title);
    });
  });
});
