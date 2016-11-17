import React, { PropTypes } from "react";

export default function BtnStart(props) {
  return (
    <button
      className={`Timer__btn-start${props.modifier}`}
      onClick={() => props.onClick()}
    >
      <i className={`fa fa-${props.hasStarted ? "stop" : "play"}`} />
    </button>
  );
}

BtnStart.propTypes = {
  hasStarted: PropTypes.bool.isRequired,
  modifier: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
