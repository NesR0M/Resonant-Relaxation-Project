import React, { useState } from 'react';
import * as Tone from 'tone';

function AudioGenerator() {
  const [relaxationTime, setRelaxationTime] = useState(1); // Limiting to short durations for testing
  const [modulatorFreq, setModulatorFreq] = useState(200); // A standard frequency for testing
  const [modulationReduction, setModulationReduction] = useState(40); // Example reduction

  const handleGenerateMidi = async () => {
    const relaxationTimeMinutes = parseFloat(relaxationTime);
    const modulatorFrequency = parseFloat(modulatorFreq);
    const modulationReductionPercent = parseFloat(modulationReduction);

    // Assuming each note plays for a fixed duration
    const noteDuration = '8n'; // Example duration, adjust as needed

    // MIDI data generation logic based on your parameters
    const midiData = [];
    const totalSeconds = Math.min(relaxationTimeMinutes, 1) * 60;
    const reductionFactor = 1 - modulationReductionPercent / 100;
    const endModulatorFreq = modulatorFrequency * reductionFactor;

    for (let time = 0; time < totalSeconds; time += Tone.Time(noteDuration).toSeconds()) {
      const frequency = linearInterpolate(modulatorFrequency, endModulatorFreq, time, totalSeconds);
      const midiNote = Tone.Frequency(frequency).toMidi();
      midiData.push({ time, note: midiNote, duration: noteDuration });
    }

    // Use Tone.js to play the generated MIDI data
    const synth = new Tone.Synth().toDestination();
    midiData.forEach(({ time, note, duration }) => {
      synth.triggerAttackRelease(Tone.Frequency(note, 'midi'), duration, time);
    });

    // Start audio context
    await Tone.start();
    console.log('MIDI playback started.');
  };

  function linearInterpolate(startValue, endValue, time, totalTime) {
    return startValue + (endValue - startValue) * (time / totalTime);
  }

  return (
    <div>
      <input
        type="number"
        value={relaxationTime}
        onChange={(e) => setRelaxationTime(e.target.value)}
        placeholder="Relaxation Time in Minutes"
      />
      <input
        type="number"
        value={modulatorFreq}
        onChange={(e) => setModulatorFreq(e.target.value)}
        placeholder="Modulator Frequency in Hz"
      />
      <input
        type="number"
        value={modulationReduction}
        onChange={(e) => setModulationReduction(e.target.value)}
        placeholder="Modulation Reduction Percentage"
      />
      <button onClick={handleGenerateMidi}>Generate and Play MIDI</button>
    </div>
  );
}

export default AudioGenerator;
