import React from "react";

import Timer from "../components/Timer";

export default function App() {
  return (
    <Timer
      remainTimeInMillis={1200000}
      totalTimeInMillis={1500000}
    />
  );
}
