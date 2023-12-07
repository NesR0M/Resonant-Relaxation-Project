import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import { Row, Col, Form, Button, Card } from 'react-bootstrap';

const MidiPlayer = ({ midiJsonData }) => {
  const [lowPassFilterFreq, setLowPassFilterFreq] = useState(500);
  const [highPassFilterFreq, setHighPassFilterFreq] = useState(50);
  const [volume, setVolume] = useState(-12);
  const [attackDuration, setAttackDuration] = useState(0.5);
  const [releaseDuration, setReleaseDuration] = useState(0.5);

  const synthRef = useRef(null);
  const lowPassFilterRef = useRef(null);
  const highPassFilterRef = useRef(null);
  const volumeRef = useRef(null);
  const midiPartRef = useRef(null);

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    lowPassFilterRef.current = new Tone.Filter(lowPassFilterFreq, "lowpass").toDestination();
    highPassFilterRef.current = new Tone.Filter(highPassFilterFreq, "highpass").toDestination();
    volumeRef.current = new Tone.Volume(volume).toDestination();

    synthRef.current.chain(
      lowPassFilterRef.current,
      highPassFilterRef.current,
      volumeRef.current,
      Tone.Destination
    );

    return () => {
      synthRef.current.dispose();
      lowPassFilterRef.current.dispose();
      highPassFilterRef.current.dispose();
      volumeRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    lowPassFilterRef.current.frequency.value = lowPassFilterFreq;
    highPassFilterRef.current.frequency.value = highPassFilterFreq;
  }, [lowPassFilterFreq, highPassFilterFreq]);

  useEffect(() => {
    volumeRef.current.volume.value = volume;
  }, [volume]);

  const playMidi = (midiJson) => {
    try {
      synthRef.current.envelope.attack = attackDuration;
      synthRef.current.envelope.release = releaseDuration;

      const notes = midiJson.tracks.flatMap(track =>
        track.notes.map(note => ({
          note: Tone.Frequency(note.midi, "midi").toNote(),
          time: note.time,
          duration: note.duration,
          velocity: note.velocity
        }))
      );

      midiPartRef.current = new Tone.Part((time, note) => {
        synthRef.current.triggerAttackRelease(note.note, note.duration, time, note.velocity);
      }, notes);

      midiPartRef.current.loop = true;
      midiPartRef.current.loopStart = 0;
      midiPartRef.current.loopEnd = '1m';

      Tone.Transport.start();
      midiPartRef.current.start(0);
    } catch (error) {
      console.error("Error in playMidi:", error);
    }
  };

  const playSound = async () => {
    try {
      if (midiJsonData) {
        await Tone.start();
        playMidi(midiJsonData);
        console.log("MIDI started playing");
      } else {
        console.error("No MIDI composition available");
      }
    } catch (error) {
      console.error("Error in playSound:", error);
    }
  };

  const stopSound = () => {
    try {
      if (midiPartRef.current) {
        midiPartRef.current.stop();
      }
      Tone.Transport.stop();
      Tone.Transport.position = 0;
      console.log("MIDI Playback Stopped");
    } catch (error) {
      console.error("Error in stopSound:", error);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <Card bg="dark" text="white" className="mb-3">
      <Card.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Low-pass Filter Frequency (Hz): {lowPassFilterFreq}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="20"
                max="1000"
                value={lowPassFilterFreq}
                onChange={(e) => setLowPassFilterFreq(parseInt(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              High-pass Filter Frequency (Hz): {highPassFilterFreq}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="10"
                max="200"
                value={highPassFilterFreq}
                onChange={(e) => setHighPassFilterFreq(parseInt(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Volume (dB): {volume}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="-24"
                max="6"
                value={volume}
                onChange={handleVolumeChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Attack Duration (s): {attackDuration}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="0.1"
                max="2"
                step="0.1"
                value={attackDuration}
                onChange={(e) => setAttackDuration(parseFloat(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Release Duration (s): {releaseDuration}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="0.1"
                max="2"
                step="0.1"
                value={releaseDuration}
                onChange={(e) => setReleaseDuration(parseFloat(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Row className="mt-4">
            <Col>
              <Button onClick={playSound} disabled={!midiJsonData} variant="outline-light">
                Play Sound
              </Button>
            </Col>
            <Col>
              <Button onClick={stopSound} disabled={!midiJsonData} variant="outline-light">
                Stop Sound
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MidiPlayer;
