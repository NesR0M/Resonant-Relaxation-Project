import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Player from "./Player";
import SimplePlayer from "./SimplePlayer";
import MidiLoader from "./LoadMidi";
import BaselineComposer from "./BaselineComposer";
import SparkleComposer from "./SparkleComposer";

import { Container, Row, Col, Button, Navbar, Alert } from 'react-bootstrap';
import { notationExample } from "./prompts";

function App() {
  const [baselineData, setBaselineData] = useState(null);
  const [error, setError] = useState(null);
  const [sparkleData, setSparkleData] = useState(null);

  const [startFrequency, setStartFrequency] = useState(null);
  const [durationInSeconds, setDurationInSeconds] = useState(null);
  const [attackInSec, setAttackInSec] = useState(null);
  const [decayInSec, setDecayInSec] = useState(null);
  const [sustainInSec, setSustainInSec] = useState(null);
  const [releaseInSec, setReleaseInSec] = useState(null);

  const resetData = () => {
    setBaselineData(null);
    setSparkleData(null);
    setError(null);
    console.log("baselineData deleted.");
  };

  //TODO load only baseline
  const loadExampleData = () => {
    try {
      const midiJson = JSON.parse(notationExample);
      setBaselineData(midiJson);
      console.log("example loaded...");
    } catch (e) {
      setError("Error loading example data: " + e.message);
      console.error("Error loading example data:", e);
    }
  };

  const handleBaselineComposition = (jsonData) => {
    try {
      setBaselineData(jsonData);
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
            <MidiLoader onCompositionComplete={handleBaselineComposition} />
          </Col>
        </Row>

        <Row className="my-3">
          <Col>
            <Button variant="primary" onClick={loadExampleData}>Load example sound</Button>
          </Col>
          <Col>
            <Button variant="danger" onClick={resetData}>Delete sound data</Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <BaselineComposer onMidiGenerated={setBaselineData}
              onStartFrequencyChange={setStartFrequency}
              onDurationInSecondsChange={setDurationInSeconds}
              onAttackInSecChange={setAttackInSec}
              onDecayInSecChange={setDecayInSec}
              onSustainInSecChange={setSustainInSec}
              onReleaseInSecChange={setReleaseInSec} />
          </Col>
        </Row>

        <Row>
          <Col>
            <Player midiJsonData={baselineData}
            onAttackInSecChange={attackInSec}
            onDecayInSecChange={decayInSec}
            onSustainInSecChange={sustainInSec}
            onReleaseInSecChange={releaseInSec}
             />
          </Col>
        </Row>
      </Container>
      <SimplePlayer midiJsonData={baselineData}/>
    </div>
  );
}

export default App;
