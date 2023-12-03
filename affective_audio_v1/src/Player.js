// Key Points of the Template:
// Synthesizer Initialization: A Tone.js Synth is created with a sine wave oscillator. You can add more configurations, like filters, in this section.

// playMidi Function: This function parses the MIDI JSON data and schedules each note for playback using synth.triggerAttackRelease.

// playSound Function: This function acts as a handler to start MIDI playback. It parses the MIDI JSON data provided as a prop and then calls playMidi.

// useEffect Hook: It's used for component lifecycle management, especially for cleaning up the synthesizer and stopping the Tone Transport when the component unmounts.

// Render Method: The component renders a button that, when clicked, triggers the playSound function to start playback.

// Error Handling: Basic error handling is included, logging an error message if no MIDI composition data is available.

// Component Props: The midiJsonData prop is expected to be passed to the MidiPlayer component, containing the MIDI JSON data to be played.

import React, { useEffect } from "react";
import * as Tone from "tone";

// React component to handle MIDI playback using Tone.js
const MidiPlayer = ({ midiJsonData }) => {
  // Initialize the synthesizer
  const synth = new Tone.Synth({
    oscillator: {
      type: "sine", // Using a sine wave oscillator
    },
    // Additional configurations (like filters) can be added here
  }).toDestination();

  // Function to play MIDI data
  const playMidi = (midiJson) => {
    const now = Tone.now();
    midiJson.tracks.forEach((track) => {
      track.notes.forEach((note) => {
        // Trigger each note with the specified parameters
        synth.triggerAttackRelease(
          Tone.Frequency(note.midi, "midi").toNote(), // Convert MIDI number to note
          note.duration, // Duration of the note
          now + note.time, // Start time of the note
          note.velocity // Velocity of the note
        );
      });
    });

    // Start the Tone Transport to manage timing
    Tone.Transport.start();
  };

  // Function to handle MIDI playback
  const playSound = () => {
    if (midiJsonData) {
      // Parse MIDI JSON data and play it
      const midiJson = JSON.parse(midiJsonData);
      playMidi(midiJson);
    } else {
      console.error("No MIDI composition available");
    }
  };

  // useEffect hook to manage component lifecycle
  useEffect(() => {
    // Any setup code can go here

    return () => {
      // Cleanup code: Stop the Transport and dispose of the synth
      Tone.Transport.stop();
      synth.dispose();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Render method for the component
  return (
    <div>
      <button onClick={playSound}>Play Vincent MIDI</button>
    </div>
  );
};

export default MidiPlayer;

// Usage in parent component
// <MidiPlayer midiJsonData={gptComposition} />
