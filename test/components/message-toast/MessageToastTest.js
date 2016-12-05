/* @flow */
import { shallow }       from "enzyme";
import { useFakeTimers } from "sinon";

import { List } from "immutable";

import Message from "../../../src/entities/message";

import MessageToast from "../../../src/components/message-toast/MessageToast";
/* eslint-disable no-duplicate-imports */
import type { Props } from "../../../src/components/message-toast/MessageToast";
/* eslint-enable */

const shallowOpts = {
  lifecycleExperimental: true,
};

describe("<MessageToast />", () => {
  let props: Props;
  let wrapper;
  let clock;

  beforeEach(() => {
    props = {
      messages: List(),
      dismiss:  () => {
        assert(!props.messages.isEmpty());
        props.messages = props.messages.skip(1);
        wrapper.setProps(props);
      },
    };
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it("shows an added message and dismisses it", () => {
    wrapper = shallow(<MessageToast {...props} />, shallowOpts);
    assert(wrapper.find(".MessageToast").length === 0);

    const msg = new Message({ title: "test", level: "DEBUG", durationType: "SHORT" });
    props.messages = props.messages.push(msg);
    wrapper.setProps(props);
    assert(wrapper.find(".MessageToast").length === 0);

    clock.tick(500);
    assert(wrapper.find(".MessageToast").length === 1);
  });

  it("shows some added messages and dismisses them in turn", () => {
    wrapper = shallow(<MessageToast {...props} />, shallowOpts);
    assert(wrapper.find(".MessageToast").length === 0);

    [
      { body: "test 1", level: "DEBUG", durationType: "SHORT" },
      { body: "test 2", level: "INFO", durationType: "LONG" },
      { body: "test 3", level: "WARN", durationType: "SHORT" },
    ].forEach((attrs) => {
      props.messages = props.messages.push(new Message(attrs));
    });

    wrapper.setProps(props);
    assert(wrapper.find(".MessageToast").length === 0);

    props.messages.forEach(({ body, level, duration }) => {
      clock.tick(300);
      assert(wrapper.find(".MessageToast").length === 1);
      assert(wrapper.find(`.MessageToast__toast_${level}`).text() === body);
      clock.tick(duration);
      assert(wrapper.find(".MessageToast").length === 0);
    });

    clock.tick(1000);
    assert(wrapper.find(".MessageToast").length === 0);
  });

  it("dismisses a toast when it is clicked", () => {
    const msg = new Message({ title: "test", level: "DEBUG", durationType: "SHORT" });
    wrapper = shallow(<MessageToast {...props} />, shallowOpts);
    props.messages = props.messages.push(msg);
    wrapper.setProps(props);
    clock.tick(300);

    assert(wrapper.find(".MessageToast").length === 1);
    wrapper.find(`.MessageToast__toast_${msg.level}`).simulate("click");
    assert(wrapper.find(".MessageToast").length === 0);
  });

  it("shows some added messages and dismisses them in turn when each toasts are clicked", () => {
    wrapper = shallow(<MessageToast {...props} />, shallowOpts);
    assert(wrapper.find(".MessageToast").length === 0);

    [
      { body: "test 1", level: "DEBUG", durationType: "SHORT" },
      { body: "test 2", level: "INFO", durationType: "LONG" },
      { body: "test 3", level: "WARN", durationType: "SHORT" },
    ].forEach((attrs) => {
      props.messages = props.messages.push(new Message(attrs));
    });

    wrapper.setProps(props);
    assert(wrapper.find(".MessageToast").length === 0);

    props.messages.forEach(({ body, level }) => {
      clock.tick(300);
      assert(wrapper.find(".MessageToast").length === 1);
      assert(wrapper.find(`.MessageToast__toast_${level}`).text() === body);
      wrapper.find(`.MessageToast__toast_${level}`).simulate("click");
      assert(wrapper.find(".MessageToast").length === 0);
    });

    clock.tick(1000);
    assert(wrapper.find(".MessageToast").length === 0);
  });
});
