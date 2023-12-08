import { Midi } from "@tonejs/midi";

const createMidi = (midiData) => {
  const midi = new Midi();

  // Set MIDI header properties
  midi.header.setTempo(midiData.header.tempos[0].bpm);
  midi.header.timeSignatures.push({
    measures: 4, // You might need to adjust this based on your data
    timeSignature: midiData.header.timeSignatures[0],
    ticks: midiData.header.timeSignatures[0].ticks,
  });
  midi.header.PPQ = midiData.header.PPQ;

  // Process each track in the JSON data
  midiData.tracks.forEach((trackData) => {
    const track = midi.addTrack();
    track.name = trackData.name;
    track.channel = trackData.channel;

    // Set instrument if available
    if (trackData.instrument) {
      track.instrument.number = trackData.instrument.number;
    }

    // Add notes to the track
    trackData.notes.forEach((noteData) => {
      track.addNote({
        midi: noteData.midi,
        time: noteData.time,
        duration: noteData.duration,
        velocity: noteData.velocity,
      });
    });

    // Add control changes if any
    if (trackData.controlChanges) {
      Object.entries(trackData.controlChanges).forEach(([number, changes]) => {
        changes.forEach((change) => {
          track.addCC({
            number: parseInt(number),
            ticks: change.ticks,
            time: change.time,
            value: change.value,
          });
        });
      });
    }
  });

    // Generate the MIDI file as a Blob
    const midiFile = midi.toArray();
    const blob = new Blob([midiFile], { type: "audio/midi" });

    // Create a data URI for the Blob
    const dataUri = URL.createObjectURL(blob);

    // Log the downloadable link to the console
    console.log("Download MIDI file: ", dataUri);

    // Optionally, you can also create an anchor element for direct download
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUri;
    downloadLink.download = "composition.mid";
    downloadLink.innerText = "Download MIDI";
    document.body.appendChild(downloadLink);
    console.log("Click the link to download MIDI file: ", downloadLink);
  };


export { createMidi };