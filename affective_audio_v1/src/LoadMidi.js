import React, { useState } from "react";
import { Midi } from "@tonejs/midi";

const MidiLoader = ({ onCompositionComplete }) => {
  const [file, setFile] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const midiData = new Uint8Array(e.target.result);
        const midi = new Midi(midiData);

        // Convert the MIDI object to JSON
        const toneJson = midi.toJSON();

        onCompositionComplete(toneJson);
        console.log(toneJson);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const fileData = () => {
    if (file) {
      return (
        <div>
          <h6>File Details:</h6>
          <p>File Name: {file.name}</p>
          <p>File Type: {file.type}</p>
          <p>Last Modified: {file.lastModifiedDate.toDateString()}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h6>Choose a MIDI file before pressing the upload button</h6>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        <input type="file" onChange={onFileChange} accept=".mid,.midi" />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      {fileData()}
    </div>
  );
};

export default MidiLoader;
