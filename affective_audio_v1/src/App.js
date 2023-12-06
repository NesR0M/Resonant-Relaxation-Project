import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import MidiPlayer from "./Player";
import MidiComposer from "./SparkleComposer";
import { notationExample } from "./prompts";
import MidiLoader from "./LoadMidi";
import BaselineComposer from "./BaselineComposer";

function App() {
  const [midiData, setMidiData] = useState(null);
  const [error, setError] = useState(null);
  const [baselineMidiData, setBaselineMidiData] = useState(null);

  const resetMidiData = () => {
    setMidiData(null);
    setBaselineMidiData(null);
    setError(null);
    console.log("midiData deleted.");
  };

  const loadExampleData = () => {
    try {
      const midiJson = JSON.parse(notationExample);
      setMidiData(midiJson);
      console.log("example loaded...");
    } catch (e) {
      setError("Error loading example data: " + e.message);
      console.error("Error loading example data:", e);
    }
  };

  const handleCompositionComplete = (jsonData) => {
    try {
      // Assuming jsonData should be a valid JSON object/string
      // Add any necessary validation or parsing here if jsonData is a string
      setMidiData(jsonData);
      console.log("MIDI Data:", jsonData);
    } catch (e) {
      setError("Error in composition completion: " + e.message);
      console.error("Error in composition completion:", e);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {error && <div className="error">{error}</div>}
        <BaselineComposer onMidiGenerated={handleCompositionComplete}/>
        <MidiComposer onCompositionComplete={handleCompositionComplete} />
        <button onClick={loadExampleData}>Load example sound</button>
        <button onClick={resetMidiData}>Delete sound data</button>
        <MidiLoader onCompositionComplete={handleCompositionComplete} />
        <MidiPlayer midiJsonData={midiData} />
      </header>
    </div>
  );
}

export default App;
