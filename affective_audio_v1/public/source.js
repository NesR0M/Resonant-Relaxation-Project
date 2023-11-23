// import MidiWriter from "https://cdn.skypack.dev/midi-writer-js@2.1.4";

// // Constants
// const TICKS_PER_BEAT = 480;  // Standard for most DAWs
// const BEATS_PER_MINUTE = 120;  // Tempo
// const SECONDS_PER_MINUTE = 60;
// const TICKS_PER_SECOND = TICKS_PER_BEAT * BEATS_PER_MINUTE / SECONDS_PER_MINUTE;

// const melody_pitch_duration_data = [[60, 0.125], [63, 0.083], [65, 0.083], [67, 0.167], [70, 0.167], [72, 0.125], [75, 0.083], [77, 0.083], [79, 0.167], [82, 0.167], [84, 0.125], [87, 0.083], [89, 0.083], [91, 0.167], [94, 0.167], [96, 0.125], [99, 0.083], [101, 0.083], [103, 0.167], [106, 0.167]];

// // Create a new track
// let track = new MidiWriter.Track();

// // Set track's ticks per beat
// //track.setTicksPerBeat(TICKS_PER_BEAT);
// track.setTempo(BEATS_PER_MINUTE)

// // Add events to the track based on your melody data
// melody_pitch_duration_data.forEach(([note, duration]) => {
//     if (note !== 0) {
//         // Note on event
//         track.addEvent(new MidiWriter.NoteEvent({ pitch: [note], duration: 'T' + Math.round(duration * TICKS_PER_SECOND), velocity: 64 }), 
//                        {sequential: true});
//     } else {
//         // Rest (silence)
//         track.addEvent(new MidiWriter.NoteEvent({ rest: true, duration: 'T' + Math.round(duration * TICKS_PER_SECOND) }), 
//                        {sequential: true});
//     }
// });

// // Generate a data URI
// let write = new MidiWriter.Writer(track);
// let dataUri = write.dataUri();

// // Assuming you have a MIDI player library that can take a data URI
// MidiPlayerLibrary.loadMidiFromDataUri(dataUri).then(player => {
//     // Play the MIDI
//     player.play();
// });
// Constants
// Constants
const melody_pitch_duration_data = [[60, 0.125], [63, 0.083], [65, 0.083], /* ... more notes ... */];

// Create a synthesizer
const synth = new Tone.Synth().toDestination();

// Start the audio context
document.getElementById('playButton').addEventListener('click', async () => {
    // Start the Tone.js context
    await Tone.start();
    console.log('Audio context started');

    // Convert pitch and duration data to Tone.js format
    const noteEvents = melody_pitch_duration_data.map(([pitch, duration]) => {
      return { time: 0, note: Tone.Midi(pitch).toFrequency(), duration: duration };
    });

    // Create a part with these events
    const part = new Tone.Part((time, event) => {
      // Use the events to play the synth
      synth.triggerAttackRelease(event.note, event.duration, time);
    }, noteEvents);

    // Start the part
    part.start(0);
});
