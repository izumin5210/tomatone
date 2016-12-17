/* @flow */
import { mount } from "enzyme";
import { spy }   from "sinon";

import React, { Component } from "react";
import { DragDropContext }  from "react-dnd";
import TestBackend          from "react-dnd-test-backend";

import TaskItem       from "../../../src/components/task-list/TaskItem";
/* eslint-disable no-duplicate-imports */
import type { Props } from "../../../src/components/task-list/TaskItem";
/* eslint-enable */

import {
  Task,
} from "../../../src/entities";

function wrapInTestContext(DecoratedComponent) {
  /* eslint-disable react/prefer-stateless-function */
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render() {
      return <DecoratedComponent {...this.props} />;
    }
  }
  /* eslint-enable */

  return TestContextContainer;
}

describe("<TaskItem />", () => {
  let props: Props;
  let wrapper;

  beforeEach(() => {
    const TaskItemContext = wrapInTestContext(TaskItem);
    const task = new Task({ id: 1, title: "awesome task" });
    props = {
      task,
      category:          undefined,
      order:             0,
      check:             spy(),
      select:            spy(),
      update:            spy(),
      delete:            spy(),
      selected:          false,
      updateOrder:       spy(),
      drag:              spy(),
      connectDragSource: spy(),
      connectDropTarget: spy(),
      isDragging:        false,
      canDrop:           false,
    };
    wrapper = mount(<TaskItemContext {...props} />);
  });

  describe("completeTask", () => {
    it("calls check() when an icon is clicked", () => {
      assert(!props.check.called);
      wrapper.find(".TaskItem__complete")
        .simulate("change", { target: { value: true } });
      assert(props.check.calledOnce);
    });
  });

  describe("selectTask", () => {
    it("calls select() when an item body is clicked", () => {
      assert(!props.select.called);
      wrapper.find(".TaskItem__select")
        .simulate("change", { target: { value: true } });
      assert(props.select.calledOnce);
    });
  });

  describe("re-order tasks", () => {
    xit("drags-and-drops a task to above");
    xit("drags-and-drops a task to below");
  });
});
