import React, { useState } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from "tone";

const BaselineComposer = ({ onMidiGenerated }) => {
  const [startFrequency, setStartFrequency] = useState(440);
  const [durationInMin, setDurationInMin] = useState(2);
  const [attackInSec, setAttackInSec] = useState(3);
  const [releaseInSec, setReleaseInSec] = useState(3);

  const generateMidi = () => {
    console.log("Starting MIDI generation...");
    
    var midi = new Midi();
    const track = midi.addTrack();
    
    let currentTime = 0;
    const totalDuration = durationInMin * 60; // Convert minutes to seconds
    console.log(`Total duration set to ${totalDuration} seconds.`);
  
    const noteDuration = attackInSec; // Duration of the note (inhale)
    const restDuration = attackInSec; // Duration of the rest (exhale)
    console.log(`Note and rest duration set to ${noteDuration} seconds each for a 1:1 inhale-exhale ratio.`);
  
    while (currentTime < totalDuration) {
      // Add note (inhale)
      track.addNote({
        midi: Tone.ftom(startFrequency),
        time: currentTime,
        duration: noteDuration,
      });
      console.log(`Added note at ${currentTime} seconds, frequency: ${startFrequency} Hz, duration: ${noteDuration} seconds.`);
  
      // Update currentTime to include the note and the rest period
      currentTime += noteDuration + restDuration;
    }
  
    console.log("MIDI generation completed.");
  
    // Pass the generated MIDI data up
    onMidiGenerated(midi);
  };
    

  return (
    <div>
      <div>
        <label>
          Start Frequency (Hz): {startFrequency}
          <input type="range" min="20" max="2000" value={startFrequency} onChange={(e) => setStartFrequency(+e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Duration (Minutes): {durationInMin}
          <input type="range" min="1" max="10" value={durationInMin} onChange={(e) => setDurationInMin(+e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Attack/Release Duration (Seconds): {attackInSec}
          <input type="range" min="1" max="10" value={attackInSec} onChange={(e) => setAttackInSec(+e.target.value)} />
        </label>
      </div>
      <button onClick={generateMidi}>Generate MIDI</button>
    </div>
  );
};

export default BaselineComposer;
