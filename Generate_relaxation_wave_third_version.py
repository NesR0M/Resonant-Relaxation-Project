import numpy as np
from scipy.io.wavfile import write
import pandas as pd

# Get user input
relaxation_time_minutes = float(input("Enter the total length of relaxation time in minutes: "))
flow_time_minutes = float(input("Enter the total length of flow time in minutes: "))
flow_bpm = float(input("Enter the BPM for the flow wave: "))
modulator_freq = float(input("Enter the frequency of the modulator wave in Hz: "))
modulation_reduction_percent = float(input("Enter the desired percentage reduction of the modulator frequency: "))

# Convert the reduction percentage to a multiplicative factor
reduction_factor = 1 - (modulation_reduction_percent / 100)

# Convert total time to seconds
total_time = relaxation_time_minutes * 60
total_flow_time = flow_time_minutes * 60

# Define the sample rate
sample_rate = 44100

# Calculate ending frequency for the relaxation wave based on the percentage reduction
end_modulator_freq_relaxation = modulator_freq * reduction_factor

# Generate the time array
time = np.linspace(0, total_time, int(total_time * sample_rate))

# Linearly interpolate the modulator frequency for the relaxation wave
modulator_freq_relaxation = np.linspace(modulator_freq, end_modulator_freq_relaxation, len(time))

# Define the start and end frequencies of the carrier wave in BPM
start_freq_bpm = 12/2
end_freq_bpm = 8/2

# Convert the frequencies to Hz
start_freq_hz = start_freq_bpm / 60
end_freq_hz = end_freq_bpm / 60

# Calculate the frequency as a function of time
freq_time_ratio = np.logspace(np.log10(start_freq_hz), np.log10(end_freq_hz), len(time))

# Calculate the instantaneous phase by integrating the frequency
phase = 2 * np.pi * np.cumsum(freq_time_ratio) / sample_rate

# Generate the modulated carrier wave with the adjusted frequency for relaxation time
waveform = np.sin(phase) * np.sin(2 * np.pi * modulator_freq_relaxation * time)

# Normalize the waveform to the range [-1, 1]
waveform = waveform / np.max(np.abs(waveform))

# Now for the flow wave:

# Calculate the rate of the beats in Hz
beats_per_second = flow_bpm / 60
pulse_duration = 1 / beats_per_second

# Generate time array for flow time
flow_time = np.linspace(0, total_flow_time, int(total_flow_time * sample_rate))

# Interpolate the modulator frequency back to original frequency
modulator_freq_flow = np.linspace(end_modulator_freq_relaxation, modulator_freq, len(flow_time))

# Define the amplitude envelope for each pulse (beat)
beat_starts = np.floor(flow_time / pulse_duration) * pulse_duration
times_into_beat = flow_time - beat_starts
sine_phases = (times_into_beat / pulse_duration) * (2 * np.pi)
amplitude_envelope = np.sin(sine_phases) * (sine_phases <= np.pi)

# Generate the flow wave with the modulating frequency being interpolated back to the original value
flow_wave = amplitude_envelope * np.sin(2 * np.pi * np.cumsum(modulator_freq_flow) / sample_rate)

# Normalize the flow waveform to the range [-1, 1]
flow_wave = flow_wave / np.max(np.abs(flow_wave))

# Concatenate the two waveforms
complete_waveform = np.concatenate((waveform, flow_wave))

# Normalize the complete waveform to the range [-1, 1]
complete_waveform = complete_waveform / np.max(np.abs(complete_waveform))

# Convert the complete waveform to 16-bit PCM
complete_waveform_int16 = np.int16(complete_waveform * 32767)

# Write the complete waveform to a .wav file
filename_complete = f"complete_waveform_{modulator_freq}Hz.wav"
write(filename_complete, sample_rate, complete_waveform_int16)

print(f"Complete waveform has been saved as '{filename_complete}'.")
