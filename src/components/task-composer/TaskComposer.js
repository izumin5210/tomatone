/* @flow */
import React, { Component } from "react";
import { Map }              from "immutable";

import { Category } from "../../entities";

import ComposerModal from "./ComposerModal";
import ComposerForm  from "./ComposerForm";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  categories: Map<number, Category>;
  createTask: (title: string) => void;
};

export type State = {
  opened: boolean;
};
/* eslint-enable */

export default class TaskComposer extends Component {

  constructor(props: Props) {
    super(props);
    this.state = { opened: false };
  }

  state: State;
  props: Props;

  close() {
    this.setState({ opened: false });
  }

  renderModal() {
    return (
      <ComposerModal
        close={() => this.close()}
      >
        <ComposerForm
          categories={this.props.categories}
          createTask={this.props.createTask}
          close={() => this.close()}
        />
      </ComposerModal>
    );
  }

  renderButton() {
    return (
      <button
        className="TaskCompoer__btn-open"
        onClick={() => this.setState({ opened: true })}
      >
        <i className="fa fa-plus" />
      </button>
    );
  }

  render() {
    return (
      <div className="TaskComposer">
        { this.state.opened && this.renderModal() }
        { this.renderButton() }
      </div>
    );
  }
}
