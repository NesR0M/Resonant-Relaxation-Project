import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import { Waveform, Spectrogram } from 'react-audio-visualize';

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

  let midiPart;
  let midiLoop;

  // Function to play MIDI data
  const playMidi = (midiJson) => {
    if (midiPart) {
      midiPart.stop();
      midiLoop.stop();
    }

    const notes = [];
    midiJson.tracks.forEach((track) => {
      track.notes.forEach((note) => {
        notes.push({
          note: Tone.Frequency(note.midi, "midi").toNote(),
          time: note.time,
          duration: note.duration,
          velocity: note.velocity,
        });
      });
    });

    midiPart = new Tone.Part((time, value) => {
      synth.triggerAttackRelease(value.note, value.duration, time, value.velocity);
    }, notes);

    midiPart.loop = true;
    midiPart.loopStart = 0;
    midiPart.loopEnd = midiPart.length - 6; // Adjusted loopEnd slightly

    midiLoop = new Tone.Loop(() => {
      midiPart.start(0);
    }, midiPart.length * notes.length);

    Tone.Transport.start();
    midiLoop.start(0);
  };



  // Function to handle MIDI playback
  const playSound = () => {
    if (midiJsonData) {
      playMidi(midiJsonData);
    } else {
      console.error("No MIDI composition available");
    }
  };

  // Function to stop MIDI playback
  const stopSound = () => {
    if (midiPart) {
      midiPart.stop();
    }
    Tone.Transport.stop();
    Tone.Transport.position = 0;
  };

  // useEffect hook for filter frequency updates
  useEffect(() => {
    lowPassFilter.frequency.value = lowPassFilterFreq;
    highPassFilter.frequency.value = highPassFilterFreq;
  }, [lowPassFilterFreq, highPassFilterFreq, lowPassFilter, highPassFilter]);

  // useEffect hook for component lifecycle management
  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      synth.dispose();
    };
  }, [synth]);

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
