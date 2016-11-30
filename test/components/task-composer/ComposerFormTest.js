/* @flow */

import { shallow }  from "enzyme";
import { spy }      from "sinon";

import ComposerForm, {
  Props,
} from "../../../src/components/task-composer/ComposerForm";

import {
  Task,
} from "../../../src/entities";

describe("<ComposerForm />", () => {
  let props: Props;
  let event: any;

  beforeEach(() => {
    props = {
      createTask: spy(),
      close:      spy(),
    };
    event = {
      preventDefault: spy(),
    };
  });

  it("create a new task when the btn-create is clicked", () => {
    const wrapper = shallow(<ComposerForm {...props} />);
    wrapper.find(".ComposerForm__input-title")
      .simulate("change", { target: { value: "new task" } });
    wrapper.find(".ComposerForm__btn-create").simulate("click", event);
    assert(props.createTask.calledOnce);
    assert(props.createTask.args[0][0] === "new task");
    assert(props.close.calledOnce);
  });

  it("create a new task when the form is submitted", () => {
    const wrapper = shallow(<ComposerForm {...props} />);
    wrapper.find(".ComposerForm__input-title")
      .simulate("change", { target: { value: "new task" } });
    wrapper.find(".ComposerForm").simulate("submit", event);
    assert(props.createTask.calledOnce);
    assert(props.createTask.args[0][0] === "new task");
    assert(props.close.calledOnce);
  });

  it("does not create new task when the form is empty and the btn-create is clicked", () => {
    const wrapper = shallow(<ComposerForm {...props} />);
    wrapper.find(".ComposerForm__btn-create").simulate("click", event);
    assert(!props.createTask.called);
    assert(!props.close.calledOnce);
  });

  it("does not create new task when the form is empty and the form is submitted", () => {
    const wrapper = shallow(<ComposerForm {...props} />);
    wrapper.find(".ComposerForm").simulate("submit", event);
    assert(!props.createTask.called);
    assert(!props.close.calledOnce);
  });
});
