import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import MidiPlayer from "./Player";
import MidiComposer from "./Composer";

function App() {
  const [midiData, setMidiData] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <MidiComposer onCompositionComplete={setMidiData} />
        <MidiPlayer midiJsonData={midiData} />
      </header>
    </div>
  );
}

export default App;
