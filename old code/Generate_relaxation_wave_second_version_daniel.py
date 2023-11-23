import numpy as np
from scipy.io.wavfile import write
import pandas as pd
 
# Get user input
relaxation_time_minutes = float(input("Enter the total length of relaxation time in minutes: "))
flow_time_minutes = float(input("Enter the total length of flow time in minutes: "))  # You will also need the duration for the flow wave
flow_bpm = float(input("Enter the BPM for the flow wave: "))  # This is the new input for the second wave's beat rate
modulator_freq = float(input("Enter the frequency of the modulator wave in Hz: "))
 
# Convert total time to seconds
total_time = relaxation_time_minutes * 60
total_flow_time = flow_time_minutes * 60
 
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



# Now, generate the flow wave, but this time you're creating a tone at modulator_freq
# and making it pulse at a rate defined by flow_bpm.

# Calculate the rate of the beats in Hz
#beats_per_second = flow_bpm / 60
#pulse_duration = 1 / beats_per_second  # the duration of each pulse
#
## Generate the tone at modulator_freq (this is continuous, not pulsed)
#flow_time = np.linspace(0, total_flow_time, int(total_flow_time * sample_rate), endpoint=False)
#flow_wave_tone = np.sin(2 * np.pi * modulator_freq * flow_time)  # the actual audible tone
#
## Now create the pulsed modulation based on flow_bpm
## We create a square wave that represents the on/off pulsing of the tone.
#pulses = np.floor(flow_time / pulse_duration)
#flow_wave_pulse = 0.5 * (1 + np.sign(np.sin(2 * np.pi * beats_per_second * flow_time)))
#
## Modulate the tone with the pulse; this turns the continuous tone into a series of pulses (beats)
#flow_wave = flow_wave_tone * flow_wave_pulse
#
## Normalize the flow waveform to the range [-1, 1]
#flow_wave = flow_wave / np.max(np.abs(flow_wave))
#
## Concatenate the two waveforms
#complete_waveform = np.concatenate((waveform, flow_wave))  # 'waveform' is the relaxation wave
#
## Normalize the complete waveform to the range [-1, 1] after concatenation
#complete_waveform = complete_waveform / np.max(np.abs(complete_waveform))
#
## Convert the complete waveform to 16-bit PCM
#complete_waveform_int16 = np.int16(complete_waveform * 32767)
#
## Write the complete waveform to a .wav file
#filename_complete = f"complete_waveform_{modulator_freq}Hz.wav"
#write(filename_complete, sample_rate, complete_waveform_int16)
#
#print(f"Complete waveform has been saved as '{filename_complete}'.")

# Calculate the rate of the beats in Hz
beats_per_second = flow_bpm / 60
pulse_duration = 1 / beats_per_second  # the duration of each pulse in seconds

# Generate the tone at modulator_freq (this is continuous, not pulsed)
flow_time = np.linspace(0, total_flow_time, int(total_flow_time * sample_rate), endpoint=False)
flow_wave_tone = np.sin(2 * np.pi * modulator_freq * flow_time)

# Create an amplitude envelope for each pulse (beat). We'll use a sine wave for smooth attack and decay,
# but we need to reset the wave at the start of each pulse, so it doesn't just look like a standard sine wave.
# Instead, it'll be a series of peaks corresponding to the beats.

# First, find the points in time where each beat starts.
beat_starts = np.floor(flow_time / pulse_duration) * pulse_duration
# Next, calculate how far into each beat we are at each point in time.
times_into_beat = flow_time - beat_starts
# Now calculate the phase of the sine wave at each point in time, resetting to 0 at the start of each beat.
# We want a full sine wave cycle to correspond to the pulse_duration, hence the division by pulse_duration.
sine_phases = (times_into_beat / pulse_duration) * (2 * np.pi)
# Finally, create the amplitude envelope. We use a sine wave, but any smooth waveform will do.
amplitude_envelope = np.sin(sine_phases) * (sine_phases <= np.pi)  # We only want the first half of the sine wave.

# Apply the amplitude envelope to the tone, effectively turning the continuous tone into a series of pulses.
flow_wave = flow_wave_tone * amplitude_envelope

# Normalize the flow waveform to the range [-1, 1]
flow_wave = flow_wave / np.max(np.abs(flow_wave))

# Concatenate the two waveforms
complete_waveform = np.concatenate((waveform, flow_wave))

# Normalize the complete waveform to the range [-1, 1] after concatenation
complete_waveform = complete_waveform / np.max(np.abs(complete_waveform))

# Convert the complete waveform to 16-bit PCM
complete_waveform_int16 = np.int16(complete_waveform * 32767)

# Write the complete waveform to a .wav file
filename_complete = f"complete_waveform_{modulator_freq}Hz.wav"
write(filename_complete, sample_rate, complete_waveform_int16)

print(f"Complete waveform has been saved as '{filename_complete}'.")