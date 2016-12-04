/* @flow */
import React, { Component }    from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import { List } from "immutable";

import { Message } from "../../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  messages: List<Message>;
  dismiss:  () => void;
};

export type State = {
  timeoutId: ?number;
  message:   ?Message;
};
/* eslint-enable */

export default class MessageToast extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      timeoutId: undefined,
      message:   undefined,
    };
  }

  state: State;

  componentDidUpdate() {
    if (this.canShow(this.props)) {
      this.readyToShow();
    }
  }

  componentWillUnmount() {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }
  }

  readyToShow() {
    const timeoutId = setTimeout(() => this.show(), 500);
    this.setState({ timeoutId });
  }

  show() {
    clearTimeout(this.state.timeoutId);
    const message = this.props.messages.first();
    const timeoutId = setTimeout(() => this.dismiss(), message.duration);
    this.setState({ message, timeoutId });
  }

  dismiss() {
    clearTimeout(this.state.timeoutId);
    this.props.dismiss();
    this.setState({ timeoutId: undefined, message: undefined });
  }

  props: Props;

  canShow(props: Props): boolean {
    return !props.messages.isEmpty()
      && this.state.message == null
      && this.state.timeoutId == null;
  }

  renderMessage() {
    const { message } = this.state;
    if (message == null) {
      return null;
    }
    return (
      <div className="MessageToast" key="MessageToast">
        <button
          onClick={() => this.dismiss()}
          className={`MessageToast__toast_${message.level}`}
        >
          { message.body }
        </button>
      </div>
    );
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="MessageToast"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        { this.renderMessage() }
      </ReactCSSTransitionGroup>
    );
  }
}
