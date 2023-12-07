import React, { useState } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from "tone";
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

import { createMidi } from './midiUtils';

const BaselineComposer = ({ 
  onMidiGenerated, 
  onStartFrequencyChange, 
  onDurationInSecondsChange, 
  onAttackInSecChange, 
  onDecayInSecChange, 
  onSustainInSecChange, 
  onReleaseInSecChange }) => {

  const [startFrequency, setStartFrequency] = useState(440); // Default frequency
  const [durationInSeconds, setDurationInSeconds] = useState(60); // Default duration
  const [attackInSec, setAttackInSec] = useState(2);
  const [decayInSec, setDecayInSec] = useState(0);
  const [sustainInSec, setSustainInSec] = useState(0);
  const [releaseInSec, setReleaseInSec] = useState(2);

  const generateMidi = () => {
    console.log("Starting MIDI generation...");
    
    var midi = new Midi();
    const defaultBpm = 60; // You can set this to a desired value
    midi.header.setTempo(defaultBpm);
    midi.header.timeSignatures.push({
      measures: 4, // Default time signature (e.g., 4/4)
      timeSignature: [4, 4],
      ticks: 0
    });
    const track = midi.addTrack();
    
    let currentTime = 0;
    const totalDuration = durationInSeconds * 60; // Convert minutes to seconds
    console.log(`Total duration set to ${totalDuration} seconds.`);
  
    const noteDuration = attackInSec + decayInSec; // Duration of the note (inhale)
    const restDuration = releaseInSec; // Duration of the rest (exhale)

    console.log(`Note and rest duration set to ${noteDuration} seconds each for a 1:1 inhale-exhale ratio.`);
  
    while (currentTime < totalDuration) {
      // Add note (inhale)
      track.addNote({
        midi: Tone.ftom(startFrequency),
        time: currentTime,
        duration: noteDuration,
        velocity: 0.8,
      });
      //console.log("Added note at ${currentTime} seconds, frequency: ${startFrequency} Hz, duration: ${noteDuration} seconds."");
  
      // Update currentTime to include the note and the rest period
      currentTime += noteDuration + restDuration;
      console.log(currentTime);
    }
  
    console.log("MIDI generation completed.");
  
    // Pass the generated MIDI data up
    onMidiGenerated(midi);
    console.log(midi);

    onStartFrequencyChange(startFrequency);
    onDurationInSecondsChange(durationInSeconds);
    onAttackInSecChange(attackInSec);
    onDecayInSecChange(decayInSec);
    onSustainInSecChange(sustainInSec);
    onReleaseInSecChange(releaseInSec);

    createMidi(midi);
  };
    
  return (
    <Card bg="dark" text="white" className="mb-3">
      <Card.Body>
        <Card.Title style={{ textAlign: 'left', fontWeight: 'bold' }}>Baseline Composer</Card.Title>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Start Frequency (Hz): {startFrequency}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="20"
                max="600"
                value={startFrequency}
                onChange={(e) => setStartFrequency(+e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Duration (Seconds): {durationInSeconds}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="1"
                max="120"
                value={durationInSeconds}
                onChange={(e) => setDurationInSeconds(+e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Attack Duration (Seconds): {attackInSec}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="0"
                max="5"
                step="0.1"
                value={attackInSec}
                onChange={(e) => setAttackInSec(parseFloat(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Decay Duration (Seconds): {decayInSec}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="0"
                max="5"
                step="0.1"
                value={decayInSec}
                onChange={(e) => setDecayInSec(parseFloat(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Sustain Level (Percentage): {sustainInSec}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="0"
                max="1"
                step="0.1"
                value={sustainInSec}
                onChange={(e) => setSustainInSec(parseFloat(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6" className="text-white">
              Release Duration (Seconds): {releaseInSec}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="0"
                max="5"
                step="0.1"
                value={releaseInSec}
                onChange={(e) => setReleaseInSec(parseFloat(e.target.value))}
              />
            </Col>
          </Form.Group>

          <Button variant="outline-light" onClick={generateMidi}>Generate MIDI</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BaselineComposer;