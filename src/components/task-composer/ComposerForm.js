/* @flow */
import React, { Component } from 'react'
import Autocomplete         from 'react-autocomplete'
import Fuse                 from 'fuse.js'

import type { Map } from 'immutable'

import type { Category } from '../../entities'

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type FuseItem = {
  id: number,
  name: string,
}

export type Props = {
  currentCategory: Category,
  categories: Map<number, Category>,
  createTask: (title: string) => void,
  close: () => void,
}

export type State = {
  title: string,
  completionResult: Array<FuseItem>,
  focused: boolean,
}
/* eslint-enable */

export default class ComposerForm extends Component {

  static fuseOptions = {
    shouldSort:     true,
    tokenize:       true,
    /* eslint-disable no-useless-escape */
    tokenSeparator: /[\s\/]+/g,
    /* eslint-enable */
    matchAllTokens: true,
    keys:           ['name'],
  };

  static pregQuotePattern = new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g');

  static createListForFuse (categories: Map<number, Category>): Array<FuseItem> {
    return categories
      .filterNot(cat => cat.isMeta)
      .map(({ id, name }) => ({ id, name }))
      .toArray()
  }

  static pregQuote (str: string): string {
    // https://github.com/kvz/locutus/blob/76ddd02483500a218eae547b68ec8735016bdd47/src/php/pcre/preg_quote.js
    return str.replace(ComposerForm.pregQuotePattern, '\\$&')
  }

  constructor (props: Props) {
    super(props)
    this.fuse = new Fuse(
      ComposerForm.createListForFuse(props.categories),
      ComposerForm.fuseOptions,
    )
    const c = this.props.currentCategory
    const title = c.isMeta ? '' : `${c.name}/`
    this.state = {
      title,
      completionResult: this.search(''),
      focused:          false,
    }
  }

  state: State;

  componentDidMount () {
    this.autocomplete.refs.input.focus()
  }

  componentWillReceiveProps ({ categories }: Props) {
    if (categories.hashCode() !== this.props.categories.hashCode()) {
      this.fuse.set(ComposerForm.createListForFuse(categories))
      const completionResult = this.search(this.state.title)
      this.setState({ completionResult })
    }
  }

  onTitleSubmit (e: any) {
    e.preventDefault()
    if (this.state.title.length > 0) {
      this.props.createTask(this.state.title)
      this.state.title = ''
      this.props.close()
    }
  }

  onTitleChange (title: string) {
    if (this.state.title !== title) {
      const completionResult = this.search(title)
      this.setState({ title, completionResult })
    }
  }

  shouldItemRender (id: number): boolean {
    return this.state.completionResult.find(({ id: otherId }) => id === otherId) != null
  }

  sortItems (id1: number, id2: number): number {
    const ids = this.state.completionResult
      .filter(({ id }) => (id === id1) || (id === id2))
      .map(({ id }) => id)
    return ids.indexOf(id1) > ids.indexOf(id2) ? 1 : -1
  }

  search (str: string): Array<FuseItem> {
    return this.fuse.search(ComposerForm.pregQuote(str))
  }

  props: Props;
  fuse: Fuse;
  autocomplete: any;

  render () {
    const inputTitleId = 'ComposerForm__input-title'
    const modifierInputted = this.state.title.length > 0 ? '_inputted' : ''
    const modifierFocused = this.state.focused ? '_focused' : ''
    return (
      <form
        onSubmit={e => this.onTitleSubmit(e)}
        className='ComposerForm'
      >
        <div className='ComposerForm__group-input-title'>
          <Autocomplete
            value={this.state.title}
            wrapperProps={{
              className: 'ComposerForm__input-title-wrapper',
            }}
            inputProps={{
              name:      inputTitleId,
              className: 'ComposerForm__input-title',
              onFocus:   () => this.setState({ focused: true }),
              onBlur:    () => this.setState({ focused: false }),
            }}
            items={this.state.completionResult}
            getItemValue={({ name }) => name}
            shouldItemRender={({ id }) => this.shouldItemRender(id)}
            sortItems={({ id: id1 }, { id: id2 }) => this.sortItems(id1, id2)}
            onChange={(e, v) => this.onTitleChange(v)}
            onSelect={v => this.onTitleChange(`${v}/`)}
            renderMenu={(items, v, style) => (
              <ul className='ComposerForm__autocomplete' {...{ style }}>
                {items}
              </ul>
            )}
            renderItem={({ id, name }, isHighlighted) => (
              <li
                key={id}
                className={`ComposerForm__autocomplete-item${isHighlighted ? '_highlighted' : ''}`}
              >
                {name}
              </li>
            )}
            ref={c => (this.autocomplete = c)}
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
          className='ComposerForm__btn-create'
        >
          <i className='fa fa-paper-plane-o' />
        </button>
      </form>
    )
  }
}
