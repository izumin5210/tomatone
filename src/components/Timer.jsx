import React, { Component, PropTypes } from "react";

export default class Timer extends Component {
  static propTypes = {
    remainTimeInMillis: PropTypes.number.isRequired,
    totalTimeInMillis: PropTypes.number.isRequired,
  }

  componentWillMount() {
  }

  getGradients() {
    const { remainTimeInMillis, totalTimeInMillis } = this.props;
    const r = remainTimeInMillis / totalTimeInMillis;
    if (r < 0.5) {
      const angle = ((r / 0.5) * 180) + 90;
      return [
        `linear-gradient(${angle}deg, transparent 50%, white 50%)`,
        "linear-gradient(90deg, white 50%, transparent 50%)",
      ];
    }

    const angle = (((r - 0.5) / 0.5) * 180) + 90;
    return [
      `linear-gradient(${angle}deg, transparent 50%, #ccc 50%)`,
      "linear-gradient(90deg, white 50%, transparent 50%)",
    ];
  }

  render() {
    const { remainTimeInMillis } = this.props;
    return (
      <div
        className="Timer"
        style={{
          backgroundImage: this.getGradients().join(", "),
        }}
      >
        <div className="Timer__time">
          {remainTimeInMillis / 1000}
        </div>
      </div>
    );
  }
}
