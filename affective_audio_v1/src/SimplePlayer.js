import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Button, Card, Form, Row, Col } from 'react-bootstrap';

const SimplePlayer = ({ baselineJsonData, sparklesJsonData, durationInSeconds }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [highpassFreq, setHighpassFreq] = useState(500); // Default frequency
  const [lowpassFreq, setLowpassFreq] = useState(1500); // Default frequency
  const [reverbDecay, setReverbDecay] = useState(1.5);
  const [reverbWet, setReverbWet] = useState(0.5);
  const baselinePartRef = useRef(null);
  const sparklesPartRef = useRef(null);

  useEffect(() => {
    const highpassFilter = new Tone.Filter(highpassFreq, "highpass").toDestination();
    const lowpassFilter = new Tone.Filter(lowpassFreq, "lowpass").toDestination();
    const reverb = new Tone.Reverb({
      decay: reverbDecay,
      wet: reverbWet
    }).toDestination();

    highpassFilter.frequency.value = highpassFreq;
    lowpassFilter.frequency.value = lowpassFreq;
    reverb.decay = reverbDecay;
    reverb.wet.value = reverbWet;

    // Create a PolySynth for baseline with ADSR envelope
    const baselineSynth = new Tone.PolySynth(Tone.Synth, {
      voiceCount: 1,
      envelope: {
        attack: 0.5,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5,
        releaseCurve: "linear"
      }
    }).connect(highpassFilter).connect(lowpassFilter).connect(reverb);

    // Create a simple Synth for sparkles without ADSR adjustments
    const sparklesSynth = new Tone.PolySynth().connect(highpassFilter).connect(lowpassFilter).connect(reverb);
    
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
  }, [baselineJsonData, sparklesJsonData, highpassFreq, lowpassFreq, reverbDecay, reverbWet]);

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
  
    // Use the duration from App.js (assuming it's the duration of the longer track)
    if (durationInSeconds) {
      Tone.Transport.loopEnd = durationInSeconds;
      console.log(isLooping);
      console.log(durationInSeconds);
    }
  };  
  
  const stopPlayback = () => {
    Tone.Transport.stop();
    Tone.Transport.seconds = 0; // Reset the transport time
    setIsPlaying(false);
  };  

  return (
    <Card bg="dark" text="white" className="mb-3">
      <Card.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Highpass Frequency: {highpassFreq}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="100"
                max="2000"
                value={highpassFreq}
                onChange={(e) => setHighpassFreq(e.target.value)}
              />
            </Col>
          </Form.Group>
  
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Lowpass Frequency: {lowpassFreq}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="100"
                max="2000"
                value={lowpassFreq}
                onChange={(e) => setLowpassFreq(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Reverb Decay: {reverbDecay}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="0.1"
                max="10"
                step="0.1"
                value={reverbDecay}
                onChange={(e) => setReverbDecay(parseFloat(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Reverb Wet: {reverbWet}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="0"
                max="1"
                step="0.01"
                value={reverbWet}
                onChange={(e) => setReverbWet(parseFloat(e.target.value))}
              />
            </Col>
          </Form.Group>
          
          <Row className="mt-3">
            <Col>
              <Button onClick={togglePlayback} variant="outline-light" disabled={!baselineJsonData && !sparklesJsonData}>
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </Col>
            <Col>
              <Button onClick={stopPlayback} variant="outline-danger" disabled={!baselineJsonData && !sparklesJsonData}>
                Stop
              </Button>
            </Col>
            <Col>
              <Button onClick={toggleLoop} variant={isLooping ? "outline-success" : "outline-light"}>
                Loop
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );  
};

export default SimplePlayer;
