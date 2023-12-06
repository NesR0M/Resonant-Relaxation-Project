import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import MidiPlayer from "./Player";
import MidiComposer from "./Composer";
import { notationExample } from "./prompts";
import MidiLoader from "./LoadMidi";

function App() {
  const [midiData, setMidiData] = useState(null);

  const resetMidiData = () => {
    setMidiData(null);
    console.log("midiData deleted.");
  };

  const loadExampleData = () => {
    const midiJson = JSON.parse(notationExample);
    setMidiData(midiJson);

    console.log("example loaded...");
  };

  const handleCompositionComplete = (jsonData) => {
    setMidiData(jsonData);
    console.log("MIDI Data:", jsonData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <MidiComposer onCompositionComplete={setMidiData} />
        <button onClick={loadExampleData}>Load example sound</button>
        <button onClick={resetMidiData}>Delete sound data</button>
        <MidiLoader onCompositionComplete={handleCompositionComplete} />
        <MidiPlayer midiJsonData={midiData} />
      </header>
    </div>
  );
}

export default App;
