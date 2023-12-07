import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import { Button, Card } from 'react-bootstrap';

const Player = ({ midiJsonData, attackDuration, decayDuration, sustainLevel, releaseDuration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const midiPartRef = useRef(null);

  useEffect(() => {
    if (midiJsonData) {
        // Create a new synth with the envelope parameters
        const synth = new Tone.Synth({
            envelope: {
                attack: attackDuration,
                decay: decayDuration,
                sustain: sustainLevel,
                release: releaseDuration
            }
        }).toDestination();

        const notes = midiJsonData.tracks.flatMap(track =>
            track.notes.map(note => ({
                note: Tone.Frequency(note.midi, "midi").toNote(),
                time: note.time,
                duration: note.duration,
                velocity: note.velocity
            }))
        );

        midiPartRef.current = new Tone.Part((time, note) => {
            synth.triggerAttackRelease(note.note, note.duration, time, note.velocity);
        }, notes);

        midiPartRef.current.loop = isLooping;
        // Schedule the part to start playing at the beginning of the Tone.Transport timeline
        midiPartRef.current.start(0);

        return () => {
            if (midiPartRef.current) {
                midiPartRef.current.dispose();
            }
            synth.dispose();
        };
    }
  }, [midiJsonData, attackDuration, decayDuration, sustainLevel, releaseDuration, isLooping]);

  const playSound = async () => {
    await Tone.start();
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
      midiPartRef.current.start(0);
      setIsPlaying(true);
    } else {
      Tone.Transport.pause();
      setIsPlaying(false);
    }
  };

  const stopSound = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
    if (midiPartRef.current) {
        midiPartRef.current.stop();
    }
  };


  const toggleLooping = () => {
    setIsLooping(!isLooping);
  };

  return (
    <Card bg="dark" text="white" className="mb-3">
      <Card.Body>
        <Button onClick={playSound} variant={isPlaying ? "outline-secondary" : "outline-light"}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button onClick={stopSound} variant="outline-light">
          Stop
        </Button>
        <Button onClick={toggleLooping} variant="outline-light">
          {isLooping ? "Disable Looping" : "Enable Looping"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Player;
