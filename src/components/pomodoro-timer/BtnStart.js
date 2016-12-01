/* @flow */
import React from "react";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  started:  boolean;
  modifier: string;
  onClick:  () => void;
};
/* eslint-enable */

export default function BtnStart(props: Props) {
  return (
    <button
      className={`PomodoroTimer__btn-start${props.modifier}`}
      onClick={() => props.onClick()}
    >
      <i className={`fa fa-${props.started ? "stop" : "play"}`} />
    </button>
  );
}
