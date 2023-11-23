# Import necessary libraries
import numpy as np
from scipy.io.wavfile import write
from scipy.interpolate import interp1d
 
# Parameters for the carrier wave
start_freq_bpm = 9  # Starting frequency in beats per minute
end_freq_bpm = 6    # Ending frequency in beats per minute
final_time_percentage = 30  # Percentage of time the waveform stays at the end frequency
 
# Convert BPM to Hertz
start_freq_hz = start_freq_bpm / 60
end_freq_hz = end_freq_bpm / 60
 
# Frequency response data for the AuraSound AST-2b-4 speaker
freq_response_data = {
    'Frequency': [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 80, 90, 100],
    'Force': [0.12, 0.15, 0.19, 0.30, 0.43, 1.02, 2.05, 1.87, 1.13, 0.78, 0.65, 0.51, 0.40, 0.39, 0.38, 0.37]
}
 
# Create an interpolation function based on the provided frequency response data
# This will be used to adjust the amplitude of the waveform to match the speaker's characteristics
interpolation_func = interp1d(freq_response_data['Frequency'], freq_response_data['Force'], kind='cubic', fill_value='extrapolate')
 
 
# Function to generate a waveform based on given parameters
def generate_waveform(total_time_minutes, modulator_start_freq=60, modulator_end_freq=35, sample_rate=44100):
    """
    Generate a waveform with a carrier frequency that decreases logarithmically 
    from start_freq_bpm to end_freq_bpm and a modulator frequency that linearly 
    transitions from modulator_start_freq to modulator_end_freq.
    """
    total_time_seconds = total_time_minutes * 60
    final_time_seconds = final_time_percentage / 100 * total_time_seconds
 
    # Time array for the decreasing phase and the constant phase
    time_decreasing = np.linspace(0, final_time_seconds, int(final_time_seconds * sample_rate), endpoint=False)
    time_constant = np.linspace(final_time_seconds, total_time_seconds, int((total_time_seconds - final_time_seconds) * sample_rate))
 
    # Concatenate the time arrays
    time = np.concatenate((time_decreasing, time_constant))
 
    # Frequency array for the decreasing phase and the constant phase
    freq_decreasing = np.logspace(np.log10(start_freq_hz), np.log10(end_freq_hz), len(time_decreasing))
    freq_constant = np.full(len(time_constant), end_freq_hz)
 
    # Concatenate the frequency arrays
    freq = np.concatenate((freq_decreasing, freq_constant))
 
    # Calculate the instantaneous phase for the carrier wave
    phase = 2 * np.pi * np.cumsum(freq) / sample_rate
 
    # Generate the carrier wave
    carrier = np.sin(phase)
 
    # Modulator frequency array that transitions from modulator_start_freq to modulator_end_freq
    modulator_freq_array = np.linspace(modulator_start_freq, modulator_end_freq, len(time))
 
    # Calculate the normalized amplitude based on the speaker's frequency response
    normalized_amplitude = interpolation_func(freq)
 
    # Generate the modulator wave
    modulator = np.sin(2 * np.pi * modulator_freq_array * time) * normalized_amplitude
 
    # Generate the waveform by modulating the carrier with the modulator
    waveform = carrier * modulator
 
    # Normalize the waveform to the range [-1, 1]
    waveform = waveform / np.max(np.abs(waveform))
 
    return waveform
 
 
# Example usage: Generate a 3-minute waveform
waveform_3min = generate_waveform(3)
file_name_3min = f"Entrainment_Wave_3Min_60-35Hz.wav"
write(file_name_3min, 44100, np.int16(waveform_3min * 32767))