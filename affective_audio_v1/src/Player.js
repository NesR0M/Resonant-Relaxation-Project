import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

const MidiPlayer = ({ midiJsonData }) => {
  // State variables
  const [lowPassFilterFreq, setLowPassFilterFreq] = useState(500);
  const [highPassFilterFreq, setHighPassFilterFreq] = useState(50);
  const [volume, setVolume] = useState(-12);
  const [attackDuration, setAttackDuration] = useState(0.5);
  const [releaseDuration, setReleaseDuration] = useState(0.5);

  // Refs for Tone.js objects
  const synthRef = useRef(null);
  const lowPassFilterRef = useRef(null);
  const highPassFilterRef = useRef(null);
  const volumeRef = useRef(null);
  const midiPartRef = useRef(null);

  useEffect(() => {
    // Initialize Tone.js objects
    synthRef.current = new Tone.Synth().toDestination();
    lowPassFilterRef.current = new Tone.Filter(lowPassFilterFreq, "lowpass").toDestination();
    highPassFilterRef.current = new Tone.Filter(highPassFilterFreq, "highpass").toDestination();
    volumeRef.current = new Tone.Volume(volume).toDestination();

    // Chain connections
    synthRef.current.chain(
      lowPassFilterRef.current,
      highPassFilterRef.current,
      volumeRef.current,
      Tone.Destination
    );

    return () => {
      // Dispose objects on unmount
      synthRef.current.dispose();
      lowPassFilterRef.current.dispose();
      highPassFilterRef.current.dispose();
      volumeRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    lowPassFilterRef.current.frequency.value = lowPassFilterFreq;
    highPassFilterRef.current.frequency.value = highPassFilterFreq;
  }, [lowPassFilterFreq, highPassFilterFreq]);

  useEffect(() => {
    volumeRef.current.volume.value = volume;
  }, [volume]);

  // Function to play MIDI data
  const playMidi = (midiJson) => {
    // Update synthesizer's envelope settings
    try {
      synthRef.current.envelope.attack = attackDuration;
      synthRef.current.envelope.release = releaseDuration;

      const notes = midiJson.tracks.flatMap(track =>
        track.notes.map(note => ({
          note: Tone.Frequency(note.midi, "midi").toNote(),
          time: note.time,
          duration: note.duration,
          velocity: note.velocity
        }))
      );

      midiPartRef.current = new Tone.Part((time, note) => {
        synthRef.current.triggerAttackRelease(note.note, note.duration, time, note.velocity);
      }, notes);

      midiPartRef.current.loop = true;
      midiPartRef.current.loopStart = 0;
      midiPartRef.current.loopEnd = '1m'; // 1 measure (adjust as needed)

      Tone.Transport.start();
      midiPartRef.current.start(0);
    } catch (error) {
      console.error("Error in playMidi:", error);
    }
  };

  // Function to handle MIDI playback
  const playSound = async () => {
    try {
      if (midiJsonData) {
        await Tone.start();
        playMidi(midiJsonData);
        console.log("MIDI started playing");
      } else {
        console.error("No MIDI composition available");
      }
    } catch (error) {
      console.error("Error in playSound:", error);
    }
  };

  // Function to stop MIDI playback
  const stopSound = () => {
    try {
      if (midiPartRef.current) {
        midiPartRef.current.stop();
      }
      Tone.Transport.stop();
      Tone.Transport.position = 0;
      console.log("MIDI Playback Stopped");
    } catch (error) {
      console.error("Error in stopSound:", error);
    }
  };

  // Function to handle volume changes
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  // Render method for the component
  return (
    <div>
      <div>
        <label>
          Low-pass Filter Frequency (Hz): {lowPassFilterFreq}
          <input
            type="range"
            min="20"
            max="1000"
            value={lowPassFilterFreq}
            onChange={(e) => setLowPassFilterFreq(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          High-pass Filter Frequency (Hz): {highPassFilterFreq}
          <input
            type="range"
            min="10"
            max="200"
            value={highPassFilterFreq}
            onChange={(e) => setHighPassFilterFreq(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Volume (dB): {volume}
          <input
            type="range"
            min="-24"
            max="6"
            value={volume}
            onChange={handleVolumeChange}
          />
        </label>
      </div>
      <div>
        <label>
          Attack Duration (s): {attackDuration}
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={attackDuration}
            onChange={(e) => setAttackDuration(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Release Duration (s): {releaseDuration}
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={releaseDuration}
            onChange={(e) => setReleaseDuration(parseFloat(e.target.value))}
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
