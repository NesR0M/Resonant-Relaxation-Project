import React, { useEffect, useState } from "react";
import * as Tone from "tone";

const MidiPlayer = ({ midiJsonData }) => {
  // State variables for filter frequencies
  const [lowPassFilterFreq, setLowPassFilterFreq] = useState(5000); // Default low-pass frequency
  const [highPassFilterFreq, setHighPassFilterFreq] = useState(100); // Default high-pass frequency

  // Initialize the synthesizer
  const synth = new Tone.Synth({
    oscillator: {
      type: "sine", // Using a sine wave oscillator
    },
    // Additional configurations (like filters) can be added here
  }).toDestination();

  // Filters initialization
  const lowPassFilter = new Tone.Filter(
    lowPassFilterFreq,
    "lowpass"
  ).toDestination();
  const highPassFilter = new Tone.Filter(
    highPassFilterFreq,
    "highpass"
  ).toDestination();

  // Connect the synth to the filters
  synth.chain(lowPassFilter, highPassFilter);

  // Function to play MIDI data
  const playMidi = (midiJson) => {
    const now = Tone.now();
    midiJson.tracks.forEach((track) => {
      track.notes.forEach((note) => {
        synth.triggerAttackRelease(
          Tone.Frequency(note.midi, "midi").toNote(), // Convert MIDI number to note
          note.duration, // Duration of the note
          now + note.time, // Start time of the note
          note.velocity // Velocity of the note
        );
      });
    });
    Tone.Transport.start();
  };

  // Function to handle MIDI playback
  const playSound = () => {
    if (midiJsonData) {
      playMidi(midiJsonData);
    } else {
      console.error("No MIDI composition available");
    }
  };

  // Function to stop MIDI playback //TODO DOES NOT WORK YET

  const stopSound = () => {
    Tone.Transport.stop();
    Tone.Transport.position = 0; // Reset the Transport position
    //synth.dispose();??
  };

  // useEffect hook for filter frequency updates
  useEffect(() => {
    lowPassFilter.frequency.value = lowPassFilterFreq;
    highPassFilter.frequency.value = highPassFilterFreq;
  }, [lowPassFilterFreq, highPassFilterFreq]);

  // useEffect hook for component lifecycle management
  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      synth.dispose();
    };
  }, []);

  // Render method for the component
  return (
    <div>
      <div>
        <label>
          Low-pass Filter Frequency:
          <input
            type="number"
            value={lowPassFilterFreq}
            onChange={(e) => setLowPassFilterFreq(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          High-pass Filter Frequency:
          <input
            type="number"
            value={highPassFilterFreq}
            onChange={(e) => setHighPassFilterFreq(e.target.value)}
          />
        </label>
      </div>
      <button onClick={playSound} disabled={!midiJsonData}>
        Play sound
      </button>
      <button onClick={stopSound} disabled={!midiJsonData}>
        Stop sound
      </button>
    </div>
  );
};

export default MidiPlayer;
