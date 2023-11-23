import MidiWriter from 'midi-writer-js';

// Constants
const TICKS_PER_BEAT = 480;  // Standard for most DAWs
const BEATS_PER_MINUTE = 120;  // Tempo
const SECONDS_PER_MINUTE = 60;
const TICKS_PER_SECOND = TICKS_PER_BEAT * BEATS_PER_MINUTE / SECONDS_PER_MINUTE;

// Create a new track
let track = new MidiWriter.Track();

// Set track's ticks per beat
track.setTicksPerBeat(TICKS_PER_BEAT);

// Add events to the track based on your melody data
melody_pitch_duration_data.forEach(([note, duration]) => {
    if (note !== 0) {
        // Note on event
        track.addEvent(new MidiWriter.NoteEvent({ pitch: [note], duration: 'T' + Math.round(duration * TICKS_PER_SECOND), velocity: 64 }), 
                       {sequential: true});
    } else {
        // Rest (silence)
        track.addEvent(new MidiWriter.NoteEvent({ rest: true, duration: 'T' + Math.round(duration * TICKS_PER_SECOND) }), 
                       {sequential: true});
    }
});

// Generate a data URI
let write = new MidiWriter.Writer(track);
let dataUri = write.dataUri();

// Code to trigger download in a browser environment
let downloadLink = document.createElement('a');
downloadLink.href = dataUri;
downloadLink.download = 'melody.mid';
document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
