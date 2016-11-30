/* @flow */
import React from "react";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  children?: React$Element<*>;
  close:     () => void;
};
/* eslint-enable */

export default function ComposerModal(props: Props) {
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div
      className="ComposerModal"
      onClick={props.close}
    >
      <div
        className="ComposerModal__modal"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        { props.children }
      </div>
    </div>
  );
}
