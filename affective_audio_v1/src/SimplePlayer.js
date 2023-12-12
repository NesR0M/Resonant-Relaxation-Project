import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Button, Card } from 'react-bootstrap';

const SimplePlayer = ({ baselineJsonData, sparklesJsonData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const baselinePartRef = useRef(null);
  const sparklesPartRef = useRef(null);

  useEffect(() => {
    // Create a PolySynth for baseline with ADSR envelope
    const baselineSynth = new Tone.MonoSynth(Tone.Synth, {
      voiceCount: 1,
      envelope: {
        attack: 0.5,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5,
        releaseCurve: "linear"
      }
    }).toDestination();

    // Create a simple Synth for sparkles without ADSR adjustments
    const sparklesSynth = new Tone.Synth().toDestination();

    // Function to create Tone.Part for given MIDI data and synth
    const createPart = (midiJson, synth, partRef) => {
      const notes = midiJson.tracks.flatMap(track =>
        track.notes.map((note, index, array) => {
          let releaseTime = 0.5; 
          if (index < array.length - 1) {
            const nextNoteTime = array[index + 1].time;
            releaseTime = Math.max(nextNoteTime - note.time - note.duration, 0.1);
          }
          return {
            note: Tone.Frequency(note.midi, "midi").toNote(),
            time: note.time,
            duration: note.duration,
            attackTime: note.duration,
            releaseTime: releaseTime
          };
        })
      );

      partRef.current = new Tone.Part((time, note) => {
        synth.set({ envelope: { attack: note.attackTime, release: note.releaseTime } });
        synth.triggerAttackRelease(note.note, note.duration, time);
      }, notes);
    };

    // Play baseline data if available
    if (baselineJsonData) {
      createPart(baselineJsonData, baselineSynth, baselinePartRef);
    }

    // Play sparkles data if available
    if (sparklesJsonData) {
      createPart(sparklesJsonData, sparklesSynth, sparklesPartRef);
    }

    // Cleanup
    return () => {
      if (baselinePartRef.current) {
        baselinePartRef.current.dispose();
      }
      baselineSynth.dispose();
      if (sparklesPartRef.current) {
        sparklesPartRef.current.dispose();
      }
      sparklesSynth.dispose();
    };
  }, [baselineJsonData, sparklesJsonData]);

  // Function to toggle playback
  const togglePlayback = async () => {
    if (!isPlaying) {
      await Tone.start();
      Tone.Transport.start();
      baselinePartRef.current?.start(0);
      sparklesPartRef.current?.start(0);
    } else {
      baselinePartRef.current?.stop();
      sparklesPartRef.current?.stop();
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
