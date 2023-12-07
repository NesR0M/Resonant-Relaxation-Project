import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Button, Card } from 'react-bootstrap';

const SimplePlayer = ({ midiJsonData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const midiPartRef = useRef(null);

  useEffect(() => {
    // Create a synth with a customizable envelope
    const synth = new Tone.Synth({
      envelope: {
        attack: 0.5, // Default attack time, will be dynamically adjusted
        decay: 0.1,
        sustain: 0.3,
        release: 0.5 // Default release time, will be dynamically adjusted
      }
    }).toDestination();

    // Function to play the MIDI data
    const playMidi = (midiJson) => {
      let previousEndTime = 0;
      const notes = midiJson.tracks.flatMap(track =>
        track.notes.map(note => {
          // Calculate the time until the next note starts
          const endTime = note.time + note.duration;
          let releaseTime = 0.1; // Default minimum release time

          if (endTime < previousEndTime) {
            // If overlapping notes, set the start time to be slightly after the previous note's end time
            note.time = previousEndTime + 0.01;
          }
          releaseTime = Math.max(endTime - previousEndTime, releaseTime);
          previousEndTime = endTime;

          return {
            note: Tone.Frequency(note.midi, "midi").toNote(),
            time: note.time,
            duration: note.duration,
            attackTime: note.duration,
            releaseTime: releaseTime
          };
        })
      );

      // Create a Tone.Part to schedule playback of the notes
      midiPartRef.current = new Tone.Part((time, note) => {
        // Adjust the attack and release times dynamically
        synth.envelope.attack = note.attackTime;
        synth.envelope.release = note.releaseTime;
        synth.triggerAttackRelease(note.note, note.duration, time);
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
      synth.dispose();
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
