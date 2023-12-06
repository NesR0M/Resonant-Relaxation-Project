import numpy as np
from scipy.io.wavfile import write
import pandas as pd

# Get user input
relaxation_time_minutes = float(input("Enter the total length of relaxation time in minutes: "))
modulator_freq = float(input("Enter the frequency of the modulator wave in Hz: "))
modulation_reduction_percent = float(input("Enter the desired percentage reduction of the modulator frequency: "))

# Convert the reduction percentage to a multiplicative factor
reduction_factor = 1 - (modulation_reduction_percent / 100)

# Convert total time to seconds
total_time = relaxation_time_minutes * 60

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

# Convert the complete waveform to 16-bit PCM
waveform_int16 = np.int16(waveform * 32767)

# Write the complete waveform to a .wav file
filename_complete = f"waveform_{modulator_freq}Hz.wav"
write(filename_complete, sample_rate, waveform_int16)

print(f"The waveform has been saved as '{filename_complete}'.")
