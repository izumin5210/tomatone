/* @flow */
import React, { Component } from "react";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  createTask: (title: string) => void;
  close:      () => void;
};

export type State = {
  title: string
};
/* eslint-enable */

export default class ComposerForm extends Component {

  constructor(props: Props) {
    super(props);
    this.state = { title: "" };
  }

  state: State;

  componentDidMount() {
    this.inputTitle.focus();
  }

  onTitleSubmit(e: any) {
    e.preventDefault();
    if (this.state.title.length > 0) {
      this.props.createTask(this.state.title);
      this.state.title = "";
      this.props.close();
    }
  }

  onTitleChange(e: any) {
    this.setState({ title: e.target.value });
  }

  props: Props;
  inputTitle: any;

  render() {
    return (
      <form
        onSubmit={e => this.onTitleSubmit(e)}
        className="ComposerForm"
      >
        <input
          className="ComposerForm__input-title"
          type="text"
          placeholder="input new task."
          ref={(c) => { this.inputTitle = c; }}
          value={this.state.title}
          onChange={e => this.onTitleChange(e)}
        />
        <button
          onClick={e => this.onTitleSubmit(e)}
          className="ComposerForm__btn-create"
        >
          <i className="fa fa-paper-plane-o" />
        </button>
      </form>
    );
  }
}
