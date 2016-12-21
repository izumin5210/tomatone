/* @flow */
import React, { Component } from "react";
import Autocomplete         from "react-autocomplete";
import { Map }              from "immutable";

import { Category } from "../../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  categories: Map<number, Category>;
  createTask: (title: string) => void;
  close:      () => void;
};

export type State = {
  title:   string;
  focused: boolean;
};
/* eslint-enable */

export default class ComposerForm extends Component {

  static shouldItemRender({ name }: Category, value: string): boolean {
    // FIXME
    return name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  }

  static sortItems({ name: name1 }, { name: name2 }: Category, value: string): number {
    // FIXME
    const c1 = name1.toLowerCase().indexOf(value.toLowerCase());
    const c2 = name2.toLowerCase().indexOf(value.toLowerCase());
    return c1 > c2 ? 1 : -1;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      title:   "",
      focused: false,
    };
  }

  state: State;

  onTitleSubmit(e: any) {
    e.preventDefault();
    if (this.state.title.length > 0) {
      this.props.createTask(this.state.title);
      this.state.title = "";
      this.props.close();
    }
  }

  onTitleChange(title: string) {
    this.setState({ title });
  }

  props: Props;

  render() {
    const inputTitleId = "ComposerForm__input-title";
    const modifierInputted = this.state.title.length > 0 ? "_inputted" : "";
    const modifierFocused = this.state.focused ? "_focused" : "";
    return (
      <form
        onSubmit={e => this.onTitleSubmit(e)}
        className="ComposerForm"
      >
        <div className="ComposerForm__group-input-title">
          <Autocomplete
            value={this.state.title}
            wrapperProps={{
              className: "ComposerForm__input-title-wrapper",
            }}
            inputProps={{
              name:      inputTitleId,
              className: "ComposerForm__input-title",
              onFocus:   () => this.setState({ focused: true }),
              onBlur:    () => this.setState({ focused: false }),
            }}
            items={this.props.categories.filterNot(c => c.isMeta).toArray()}
            getItemValue={item => item.name}
            shouldItemRender={(cat, v) => ComposerForm.shouldItemRender(cat, v)}
            sortItems={(cat1, cat2, v) => ComposerForm.sortItems(cat1, cat2, v)}
            onChange={(e, v) => this.onTitleChange(v)}
            onSelect={v => this.onTitleChange(v)}
            renderMenu={(items, v, style) => (
              <ul className="ComposerForm__autocomplete" {...{ style }}>
                {items}
              </ul>
            )}
            renderItem={({ id, name }, isHighlighted) => (
              <li
                key={id}
                className={`ComposerForm__autocomplete-item${isHighlighted ? "_highlighted" : ""}`}
              >
                {name}
              </li>
            )}
          />
          <hr className={`ComposerForm__hr-input-title${modifierFocused}`} />
          <label
            htmlFor={inputTitleId}
            className={`ComposerForm__label-input-title${modifierFocused}${modifierInputted}`}
          >
            category1/category2/task title
          </label>
          <label
            htmlFor={inputTitleId}
            className={`ComposerForm__hint-input-title${modifierFocused}${modifierInputted}`}
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
