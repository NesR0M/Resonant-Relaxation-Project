import React, { useState } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from "tone";
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const BaselineComposer = ({ onMidiGenerated }) => {
  const [startFrequency, setStartFrequency] = useState(440);
  const [durationInMin, setDurationInMin] = useState(2);
  const [attackInSec, setAttackInSec] = useState(3);
  const [releaseInSec, setReleaseInSec] = useState(3);

  const generateMidi = () => {
    console.log("Starting MIDI generation...");
    
    var midi = new Midi();
    const track = midi.addTrack();
    
    let currentTime = 0;
    const totalDuration = durationInMin * 60; // Convert minutes to seconds
    console.log(`Total duration set to ${totalDuration} seconds.`);
  
    const noteDuration = attackInSec; // Duration of the note (inhale)
    const restDuration = attackInSec; // Duration of the rest (exhale)
    console.log(`Note and rest duration set to ${noteDuration} seconds each for a 1:1 inhale-exhale ratio.`);
  
    while (currentTime < totalDuration) {
      // Add note (inhale)
      track.addNote({
        midi: Tone.ftom(startFrequency),
        time: currentTime,
        duration: noteDuration,
      });
      console.log(`Added note at ${currentTime} seconds, frequency: ${startFrequency} Hz, duration: ${noteDuration} seconds.`);
  
      // Update currentTime to include the note and the rest period
      currentTime += noteDuration + restDuration;
    }
  
    console.log("MIDI generation completed.");
  
    // Pass the generated MIDI data up
    onMidiGenerated(midi);
  };
    

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6">
              Start Frequency (Hz): {startFrequency}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="20"
                max="2000"
                value={startFrequency}
                onChange={(e) => setStartFrequency(+e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6">
              Duration (Minutes): {durationInMin}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="1"
                max="10"
                value={durationInMin}
                onChange={(e) => setDurationInMin(+e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="6">
              Attack/Release Duration (Seconds): {attackInSec}
            </Form.Label>
            <Col sm="6">
              <Form.Range
                min="1"
                max="10"
                value={attackInSec}
                onChange={(e) => setAttackInSec(+e.target.value)}
              />
            </Col>
          </Form.Group>

          <Button variant="primary" onClick={generateMidi}>Generate MIDI</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BaselineComposer;
