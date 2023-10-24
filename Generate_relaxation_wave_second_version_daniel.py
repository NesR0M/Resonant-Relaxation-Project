import numpy as np
from scipy.io.wavfile import write
import pandas as pd
 
# Get user input
relaxtion_time_minutes = float(input("Enter the total length of relaxion time in minutes: "))
#flow_time_minutes = float(input("Enter the total length of flow time in minutes: "))

#final_time_percentage = float(input("Enter the desired percentage of time at the final 6 BPM rate: "))
modulator_freq = float(input("Enter the frequency of the modulator wave in Hz: "))
 
# Convert total time to seconds
total_time = relaxtion_time_minutes * 60
 
# Define the sample rate
sample_rate = 44100
 
# Generate the time array
# 'int' is used to cast the float to an integer since 'np.linspace' expects an integer for the number of samples
time = np.linspace(0, total_time, int(total_time * sample_rate))

 
# Define the start and end frequencies of the carrier wave in BPM
# For adults, a typical resting respiratory rate (the number of breaths per minute) is anywhere from 12 to 20 breaths.
start_freq_bpm = 12/2
end_freq_bpm = 8/2
 
# Convert the frequencies to Hz
start_freq_hz = start_freq_bpm / 60
end_freq_hz = end_freq_bpm / 60
 
# Calculate the frequency as a function of time
freq_time_ratio = np.logspace(np.log10(start_freq_hz), np.log10(end_freq_hz), len(time))
 
# Calculate the instantaneous phase by integrating the frequency
phase = 2 * np.pi * np.cumsum(freq_time_ratio) / sample_rate
 
# Generate the carrier wave
carrier = np.sin(phase)
 
# Generate the modulator wave
modulator = np.sin(2 * np.pi * modulator_freq * time)
 
# Modulate the carrier wave with the modulator wave
waveform = carrier * modulator
 
# Normalize the waveform to the range [-1, 1]
waveform = waveform / np.max(np.abs(waveform))
 
# Convert the waveform to 16-bit PCM
waveform_int16 = np.int16(waveform * 32767)
 
# Write the waveform to a .wav file
filename = f"waveform_{modulator_freq}Hz.wav"
write(filename, sample_rate, waveform_int16)
 
## Create a DataFrame with the waveform data
#waveform_df = pd.DataFrame({
#    'Time': time,
#    'Amplitude': waveform
#})
# 
## Write the DataFrame to a CSV file
#csv_filename = f"waveform_{modulator_freq}Hz.csv"
#waveform_df.to_csv(csv_filename, index=False)
# 
#print(f"Waveform and CSV file have been saved as '{filename}' and '{csv_filename}', respectively.")