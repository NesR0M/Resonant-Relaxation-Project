import React, { useState } from 'react';

const WaveformGenerator = () => {
    const [relaxationTimeMinutes, setRelaxationTimeMinutes] = useState('');
    const [modulatorFreq, setModulatorFreq] = useState('');
    const [modulationReductionPercent, setModulationReductionPercent] = useState('');
    const [generatedWaveform, setGeneratedWaveform] = useState(null);

    const generateWaveform = () => {
        const relaxationTime = parseFloat(relaxationTimeMinutes) * 60;
        const modFreq = parseFloat(modulatorFreq);
        const modulationReduction = parseFloat(modulationReductionPercent);

        const reductionFactor = 1 - (modulationReduction / 100);
        const sampleRate = 44100;
        const totalSamples = relaxationTime * sampleRate;
        const endModulatorFreq = modFreq * reductionFactor;

        const waveform = new Float32Array(totalSamples);
        let phase = 0;
        let maxVal = 0;

        for (let i = 0; i < totalSamples; i++) {
            const time = i / sampleRate;
            const modulatorFrequency = modFreq + ((endModulatorFreq - modFreq) * (i / totalSamples));
            phase += 2 * Math.PI * modulatorFrequency / sampleRate;
            waveform[i] = Math.sin(phase);
            maxVal = Math.max(maxVal, Math.abs(waveform[i]));
        }

        for (let i = 0; i < totalSamples; i++) {
            waveform[i] /= maxVal;
        }

        const buffer = new ArrayBuffer(waveform.length * 2);
        const view = new DataView(buffer);
        waveform.forEach((value, index) => {
            view.setInt16(index * 2, value * 32767, true);
        });

        setGeneratedWaveform(new Blob([buffer], { type: 'audio/wav' }));
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
