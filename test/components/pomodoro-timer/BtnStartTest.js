/* @flow */

import { shallow }  from "enzyme";
import { spy }      from "sinon";

import BtnStart from "../../../src/components/pomodoro-timer/BtnStart";

describe("<BtnStart />", () => {
  it("renders stop icon when the timer has already started", () => {
    const props = {
      hasStarted: true,
      modifier:   "",
      onClick:    () => {},
    };
    const wrapper = shallow(<BtnStart {...props} />);
    assert(wrapper.find(".fa-stop").length, 1);
  });

  it("renders stop icon when the timer has not started yet", () => {
    const props = {
      hasStarted: false,
      modifier:   "",
      onClick:    () => {},
    };
    const wrapper = shallow(<BtnStart {...props} />);
    assert(wrapper.find(".fa-play").length, 1);
  });

  it("has PomorodoTimer__btn-start_awesome-state class", () => {
    const props = {
      hasStarted: false,
      modifier:   "_awesome-state",
      onClick:    () => {},
    };
    const wrapper = shallow(<BtnStart {...props} />);
    assert(wrapper.find(".PomodoroTimer__btn-start_awesome-state").length, 1);
  });

  it("calls onClick on button click", () => {
    const props = {
      hasStarted: false,
      modifier:   "",
      onClick:    spy(),
    };
    const wrapper = shallow(<BtnStart {...props} />);
    assert(!props.onClick.called);
    wrapper.find("button").simulate("click");
    assert(props.onClick.called);
  });
});
