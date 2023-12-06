import React from "react";
import OpenAI from "openai";

import { Midi } from "@tonejs/midi";
import { prompt } from "./prompts";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

const MidiComposer = ({ onCompositionComplete }) => {
  const cleanGPTOutput = (inputString) => {
    let startIndex = inputString.indexOf("{");
    let braceCount = 0;
    let endIndex = startIndex;

    if (startIndex === -1) {
      console.error("JSON data not found in the message");
      return null;
    }

    while (endIndex < inputString.length) {
      if (inputString[endIndex] === "{") {
        braceCount++;
      } else if (inputString[endIndex] === "}") {
        braceCount--;
        if (braceCount === 0) {
          break;
        }
      }
      endIndex++;
    }

    if (braceCount !== 0) {
      console.error("Incomplete JSON data");
      return null;
    }

    return inputString.substring(startIndex, endIndex + 1);
  };

  const composeGPT = async () => {
    console.log("gpt is composing...");
    try {
      let completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content:
              prompt + "Give me only the MIDI File Syntax nothing else.",
          },
        ],
        temperature: 1,
      });

      let output = completion.choices[0]?.message?.content;
      console.log("This was the original message: " + output);

      let composition = cleanGPTOutput(output);
      console.log(composition);

      // Parse MIDI JSON data
      const midiJsonData = JSON.parse(composition);
      onCompositionComplete(midiJsonData);
      createMidi(midiJsonData);

    } catch (error) {
      console.error("Error with OpenAI completion:", error);
    }
  };

  const createMidi = (midiData) => {
    const midi = new Midi();

    // Set MIDI header properties
    midi.header.setTempo(midiData.header.tempos[0].bpm);
    midi.header.timeSignatures.push({
      measures: midiData.header.timeSignatures[0].measures,
      timeSignature: midiData.header.timeSignatures[0].timeSignature,
      ticks: midiData.header.timeSignatures[0].ticks,
    });

    // Process each track in the JSON data
    midiData.tracks.forEach((trackData) => {
      const track = midi.addTrack();
      track.channel = trackData.channel;
      track.name = trackData.name;
      if (trackData.instrument && trackData.instrument.number !== undefined) {
        // Assuming the Midi library supports this way of setting instrument
        track.instrument = trackData.instrument;
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
        Object.entries(trackData.controlChanges).forEach(
          ([number, changes]) => {
            changes.forEach((change) => {
              track.addCC({
                number: change.number,
                ticks: change.ticks,
                value: change.value,
              });
            });
          }
        );
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

  return (
    <div>
      <button onClick={composeGPT}>Generate sound</button>
    </div>
  );
};

export default MidiComposer;
