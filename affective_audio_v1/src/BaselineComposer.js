import React, { useState } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from "tone";

const BaselineComposer = ({ onMidiGenerated }) => {
  const [startFrequency, setStartFrequency] = useState(440); // default A4
  const [durationInMin, setDurationInMin] = useState(2);
  const [attackInSec, setAttackInSec] = useState(3);
  const [releaseInSec, setReleaseInSec] = useState(3);

  const generateMidi = () => {
    var midi = new Midi();
    const track = midi.addTrack();
    
    let currentTime = 0;
    const totalDuration = durationInMin * 60; // Convert minutes to seconds
    const noteDuration = attackInSec;
    const restDuration = releaseInSec;

    while (currentTime < totalDuration) {
      // Add note
      track.addNote({
        midi: Tone.ftom(startFrequency),
        time: currentTime,
        duration: noteDuration,
      });
      currentTime += noteDuration + restDuration;
    }

    // Pass the generated MIDI data up
    onMidiGenerated(midi);
  };

  return (
    <div>
      <input type="number" value={startFrequency} onChange={(e) => setStartFrequency(+e.target.value)} />
      <input type="number" value={durationInMin} onChange={(e) => setDurationInMin(+e.target.value)} />
      <input type="number" value={attackInSec} onChange={(e) => setAttackInSec(+e.target.value)} />
      <input type="number" value={releaseInSec} onChange={(e) => setReleaseInSec(+e.target.value)} />
      <button onClick={generateMidi}>Generate MIDI</button>
    </div>
  );
};

export default BaselineComposer;
