import React from "react";

import Timer from "../components/Timer";

export default function App() {
  return (
    <div className="App">
      <header className="App__header" />
      <main className="App__main">
        <Timer
          remainTimeInMillis={1200000}
          totalTimeInMillis={1500000}
        />
      </main>
      <footer className="App__footer" />
    </div>
  );
}
