import React, { useState } from 'react';
import toWav from 'audiobuffer-to-wav';

const WaveformGenerator = () => {
    // State Hooks
    const [relaxationTimeMinutes, setRelaxationTimeMinutes] = useState('');
    const [modulatorFreq, setModulatorFreq] = useState('');
    const [modulationReductionPercent, setModulationReductionPercent] = useState('');
    const [generatedWaveform, setGeneratedWaveform] = useState(null);

    const generateWaveform = () => {
        // Convert inputs to floats
        const relaxationTime = parseFloat(relaxationTimeMinutes) * 60; // Total time in seconds
        const modFreq = parseFloat(modulatorFreq);
        const modulationReduction = parseFloat(modulationReductionPercent);

        const reductionFactor = 1 - (modulationReduction / 100);
        const sampleRate = 44100;
        const totalSamples = relaxationTime * sampleRate;
        const endModulatorFreq = modFreq * reductionFactor;

        // Initialize the Audio Context
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = audioCtx.createBuffer(1, totalSamples, sampleRate);

        // Filling the AudioBuffer
        const channelData = audioBuffer.getChannelData(0);
        let phase = 0;
        let maxVal = 0;

        // Linear interpolation for modulator frequency
        const interpolateModulatorFreq = (start, end, length) => {
            return Array.from({ length }, (_, i) => start + (i * (end - start) / (length - 1)));
        };

        // Logarithmic interpolation for carrier frequency (BPM to Hz)
        const interpolateLogFreq = (startHz, endHz, length) => {
            const logStart = Math.log10(startHz);
            const logEnd = Math.log10(endHz);
            return Array.from({ length }, (_, i) => Math.pow(10, logStart + (i * (logEnd - logStart) / (length - 1))));
        };

        const modulatorFreqArray = interpolateModulatorFreq(modFreq, endModulatorFreq, totalSamples);
        const startFreqHz = (12 / 2) / 60; // Convert BPM to Hz
        const endFreqHz = (8 / 2) / 60; // Convert BPM to Hz
        const freqTimeRatio = interpolateLogFreq(startFreqHz, endFreqHz, totalSamples);

        for (let i = 0; i < totalSamples; i++) {
            phase += 2 * Math.PI * freqTimeRatio[i] / sampleRate;
            channelData[i] = Math.sin(phase) * Math.sin(2 * Math.PI * modulatorFreqArray[i] * (i / sampleRate));
            maxVal = Math.max(maxVal, Math.abs(channelData[i]));
        }

        // Normalize the waveform
        for (let i = 0; i < totalSamples; i++) {
            channelData[i] /= maxVal;
        }

        // Convert AudioBuffer to WAV
        const wav = toWav(audioBuffer);
        setGeneratedWaveform(new Blob([wav], { type: 'audio/wav' }));

        audioCtx.close();
    };

    const downloadWaveform = () => {
        if (generatedWaveform) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(generatedWaveform);
            link.download = `waveform_${modulatorFreq}Hz.wav`;
            link.click();
        }
    };

    return (
        <div>
            <input 
                type="number"
                placeholder="Relaxation Time in Minutes"
                value={relaxationTimeMinutes}
                onChange={(e) => setRelaxationTimeMinutes(e.target.value)}
            />
            <input 
                type="number"
                placeholder="Modulator Frequency in Hz"
                value={modulatorFreq}
                onChange={(e) => setModulatorFreq(e.target.value)}
            />
            <input 
                type="number"
                placeholder="Modulation Reduction Percent"
                value={modulationReductionPercent}
                onChange={(e) => setModulationReductionPercent(e.target.value)}
            />
            <button onClick={generateWaveform}>Generate Waveform</button>
            {generatedWaveform && <button onClick={downloadWaveform}>Download Waveform</button>}
        </div>
    );
};

export default WaveformGenerator;
