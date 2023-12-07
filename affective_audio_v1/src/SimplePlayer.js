import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Button, Card } from 'react-bootstrap';

const SimplePlayer = ({ midiJsonData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const midiPartRef = useRef(null);

  useEffect(() => {
    // Create a PolySynth with polyphony=1 and a customizable envelope
    const polySynth = new Tone.PolySynth(Tone.Synth, {
      voiceCount: 1,
      envelope: {
        attack: 0.5, // Default attack time
        decay: 0.1,
        sustain: 0.3,
        release: 0.5, // Default release time, will be dynamically adjusted
        releaseCurve: "linear" // Set release curve to linear
      }
    }).toDestination();

    // Function to play the MIDI data
    const playMidi = (midiJson) => {
      const notes = midiJson.tracks.flatMap(track =>
        track.notes.map((note, index, array) => {
          // Calculate the release time based on the gap to the next note
          let releaseTime = 0.5; // Default release time
          if (index < array.length - 1) {
            const nextNoteTime = array[index + 1].time;
            releaseTime = Math.max(nextNoteTime - note.time - note.duration, 0.1); // Ensure minimum release time
          }

          return {
            note: Tone.Frequency(note.midi, "midi").toNote(),
            time: note.time,
            duration: note.duration,
            attackTime: note.duration, // Attack time equal to note duration
            releaseTime: releaseTime
          };
        })
      );

      // Create a Tone.Part to schedule playback of the notes
      midiPartRef.current = new Tone.Part((time, note) => {
        // Adjust the attack and release times dynamically
        polySynth.set({ envelope: { attack: note.attackTime, release: note.releaseTime } });
        polySynth.triggerAttackRelease(note.note, note.duration, time);
      }, notes);

      // Start playback
      Tone.Transport.start();
      midiPartRef.current.start(0);
    };

    // If there's MIDI data, play it
    if (midiJsonData) {
      playMidi(midiJsonData);
    }

    // Cleanup
    return () => {
      if (midiPartRef.current) {
        midiPartRef.current.dispose();
      }
      polySynth.dispose();
    };
  }, [midiJsonData]);

  // Function to toggle playback
  const togglePlayback = async () => {
    if (!isPlaying && midiJsonData) {
      await Tone.start();
      Tone.Transport.start();
      midiPartRef.current.start(0);
    } else {
      midiPartRef.current.stop();
      Tone.Transport.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Card bg="dark" text="white" className="mb-3">
      <Card.Body>
        <Button onClick={togglePlayback} variant="outline-light">
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default SimplePlayer;
