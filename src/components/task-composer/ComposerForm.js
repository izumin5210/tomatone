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
    const inputTitleId = "ComposerForm__input-title";
    const modifierForHint = this.state.title.length > 0 ? "_hidden" : "";
    return (
      <form
        onSubmit={e => this.onTitleSubmit(e)}
        className="ComposerForm"
      >
        <div className="ComposerForm__group-input-title">
          <input
            type="text"
            className="ComposerForm__input-title"
            name={inputTitleId}
            ref={(c) => { this.inputTitle = c; }}
            value={this.state.title}
            onChange={e => this.onTitleChange(e)}
          />
          <hr className="ComposerForm__hr-input-title" />
          <label
            htmlFor={inputTitleId}
            className="ComposerForm__label-input-title"
          >
            category1/category2/task title
          </label>
          <label
            htmlFor={inputTitleId}
            className={`ComposerForm__hint-input-title${modifierForHint}`}
          >
            input new task.
          </label>
        </div>
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
