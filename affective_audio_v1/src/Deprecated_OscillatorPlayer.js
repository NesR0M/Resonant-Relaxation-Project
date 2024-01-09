import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Button, Card, Form, Row, Col } from "react-bootstrap";

const Deprecated_OscillatorPlayer = ({
  baselineJsonData,
  sparklesJsonData,
  durationInSeconds,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const baselinePartRef = useRef(null);
  const sparklesPartRef = useRef(null);

  useEffect(() => {
    // Function to create Tone.Part for given MIDI data and oscillator
    const createPart = (midiJson, partRef) => {
      const notes = midiJson.tracks.flatMap((track) =>
        track.notes.map((note) => ({
          frequency: Tone.Frequency(note.midi, "midi").toFrequency(),
          time: note.time,
          duration: note.duration,
        }))
      );

      partRef.current = new Tone.Part((time, value) => {
        const oscillator = new Tone.Oscillator(value.frequency).toDestination();
        oscillator.start(time).stop(time + value.duration);
      }, notes);
    };

    // Play baseline data if available
    if (baselineJsonData) {
      createPart(baselineJsonData, baselinePartRef);
    }

    // Play sparkles data if available
    if (sparklesJsonData) {
      createPart(sparklesJsonData, sparklesPartRef);
    }

    // Cleanup
    return () => {
      if (baselinePartRef.current) {
        baselinePartRef.current.dispose();
      }
      if (sparklesPartRef.current) {
        sparklesPartRef.current.dispose();
      }
    };
  }, [baselineJsonData, sparklesJsonData]);

  // Function to toggle playback
  const togglePlayback = async () => {
    if (!isPlaying) {
      await Tone.start();
      if (Tone.Transport.state !== "started") {
        Tone.Transport.start();
        baselinePartRef.current?.start(0);
        sparklesPartRef.current?.start(0);
      }
    } else {
      Tone.Transport.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    Tone.Transport.loop = !Tone.Transport.loop;
    if (durationInSeconds) {
      Tone.Transport.loopEnd = durationInSeconds;
    }
  };

  const stopPlayback = () => {
    Tone.Transport.stop();
    Tone.Transport.seconds = 0;
    setIsPlaying(false);
  };

  return (
    <Card bg="dark" text="white" className="mb-3">
      <Card.Body>
        <Form>
          <Row className="mt-3">
            <Col>
              <Button
                onClick={togglePlayback}
                variant="outline-light"
                disabled={!baselineJsonData && !sparklesJsonData}
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </Col>
            <Col>
              <Button
                onClick={stopPlayback}
                variant="outline-danger"
                disabled={!baselineJsonData && !sparklesJsonData}
              >
                Stop
              </Button>
            </Col>
            <Col>
              <Button
                onClick={toggleLoop}
                variant={isLooping ? "outline-success" : "outline-light"}
              >
                Loop
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};
export default Deprecated_OscillatorPlayer;
