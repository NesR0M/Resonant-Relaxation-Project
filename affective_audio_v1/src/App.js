import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

import MidiPlayer from "./Player";
import BaselineComposer from "./BaselineComposer"; // Import BaselineComposer
import { notationExample } from "./prompts";
import MidiLoader from "./LoadMidi";
import { Container, Row, Col, Button, Navbar, Alert } from 'react-bootstrap';

function App() {
  const [midiData, setMidiData] = useState(null);
  const [error, setError] = useState(null);

  const resetMidiData = () => {
    setMidiData(null);
    setError(null);
    console.log("midiData deleted.");
  };

  const loadExampleData = () => {
    try {
      const midiJson = JSON.parse(notationExample);
      setMidiData(midiJson);
      console.log("example loaded...");
    } catch (e) {
      setError("Error loading example data: " + e.message);
      console.error("Error loading example data:", e);
    }
  };

  const handleCompositionComplete = (jsonData) => {
    try {
      setMidiData(jsonData);
      console.log("MIDI Data:", jsonData);
    } catch (e) {
      setError("Error in composition completion: " + e.message);
      console.error("Error in composition completion:", e);
    }
  };

  return (
    <div className="App">
      <Container>
        <Navbar variant="dark" className="mb-3">
          <Container>
            <Navbar.Brand href="#home">
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
              React MIDI Player
            </Navbar.Brand>
          </Container>
        </Navbar>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          <Col>
            <BaselineComposer onMidiGenerated={setMidiData} />
          </Col>
        </Row>

        <Row className="my-3">
          <Col>
            <Button variant="primary" onClick={loadExampleData}>Load example sound</Button>
          </Col>
          <Col>
            <Button variant="danger" onClick={resetMidiData}>Delete sound data</Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <MidiLoader onCompositionComplete={handleCompositionComplete} />
          </Col>
        </Row>

        <Row>
          <Col>
            <MidiPlayer midiJsonData={midiData} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
