import React, { useState } from 'react';

function AudioGenerator() {
  const [relaxationTime, setRelaxationTime] = useState(1); // Limiting to short durations for testing
  const [modulatorFreq, setModulatorFreq] = useState(200); // A standard frequency for testing
  const [modulationReduction, setModulationReduction] = useState(40); // Example reduction

  const handleGenerate = async () => {
    const relaxationTimeMinutes = parseFloat(relaxationTime);
    const modulatorFrequency = parseFloat(modulatorFreq);
    const modulationReductionPercent = parseFloat(modulationReduction);

    // Simplifying the sample rate for performance
    const sampleRate = 44100; // Lower sample rate for testing
    const totalSeconds = Math.min(relaxationTimeMinutes, 1) * 60; // Limiting to max 1 minute
    const totalSamples = totalSeconds * sampleRate;
    const reductionFactor = 1 - modulationReductionPercent / 100;
    const endModulatorFreq = modulatorFrequency * reductionFactor;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: sampleRate,
    });

    const myArrayBuffer = audioCtx.createBuffer(1, totalSamples, sampleRate);

    console.log('Starting audio generation...');
    for (let i = 0; i < myArrayBuffer.length; i++) {
      const nowBuffering = myArrayBuffer.getChannelData(0);
      const time = i / sampleRate;
      const modulatorFreqAtTime = linearInterpolate(modulatorFrequency, endModulatorFreq, time, totalSeconds);
      nowBuffering[i] = Math.sin(2 * Math.PI * modulatorFreqAtTime * time);
    }
    console.log('Audio generation completed.');

    const source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start();
    console.log('Playback started.');
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
      <button onClick={handleGenerate}>Generate and Play Audio</button>
    </div>
  );
}

export default AudioGenerator;
