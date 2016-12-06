/* @flow */
import React from "react";

/* eslint-disable no-multi-spaces */
type Props = {
  id:      string;
  icon:    string;
  visible: boolean;
  onClick: (e: any) => void;
};
/* eslint-enable */

export default function TaskItemButton({ id, icon, visible, onClick }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <button
      className="TaskItemContent__button_small"
      {...{ id, onClick }}
    >
      <i className={`fa fa-${icon}`} />
    </button>
  );
}
