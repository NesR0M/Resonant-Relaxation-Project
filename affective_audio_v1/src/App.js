import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Player from "./Player";
import SimplePlayer from "./SimplePlayer";
import MidiLoader from "./LoadMidi";
import BaselineComposer from "./BaselineComposer";
import SparkleComposer from "./SparkleComposer";

import { Container, Row, Col, Button, Navbar, Alert } from "react-bootstrap";

function App() {
  const [baselineData, setBaselineData] = useState(null);
  const [error, setError] = useState(null);
  const [sparklesData, setSparklesData] = useState(null);

  const [startFrequency, setStartFrequency] = useState(null);
  const [durationInSeconds, setDurationInSeconds] = useState(null);
  const [attackInSec, setAttackInSec] = useState(null);
  const [decayInSec, setDecayInSec] = useState(null);
  const [sustainInSec, setSustainInSec] = useState(null);
  const [releaseInSec, setReleaseInSec] = useState(null);

  const handleBaselineComposition = (jsonData) => {
    try {
      setBaselineData(jsonData);
      console.log("Baseline Data:", jsonData);
    } catch (e) {
      setError("Error in baseline composition completion: " + e.message);
      console.error("Error in baseline composition completion:", e);
    }
  };

  const handleSparklesComposition = (jsonData) => {
    try {
      setSparklesData(jsonData);
      console.log("Sparkles Data:", jsonData);
    } catch (e) {
      setError("Error in sparkles composition completion: " + e.message);
      console.error("Error in sparkles composition completion:", e);
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
              />{" "}
              React MIDI Player
            </Navbar.Brand>
          </Container>
        </Navbar>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          <Col>
          <MidiLoader
            onBaselineCompositionComplete={handleBaselineComposition}
            onSparklesCompositionComplete={handleSparklesComposition}
            setBaselineData={setBaselineData}
            setSparklesData={setSparklesData}
          />
          </Col>
        </Row>
        <Row>
          <Col>
            <BaselineComposer
              onBaselineGenerated={handleBaselineComposition}
              onStartFrequencyChange={setStartFrequency}
              onDurationInSecondsChange={setDurationInSeconds}
              onAttackInSecChange={setAttackInSec}
              onDecayInSecChange={setDecayInSec}
              onSustainInSecChange={setSustainInSec}
              onReleaseInSecChange={setReleaseInSec}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <SparkleComposer
              baselineJsonData={baselineData}
              sparklesJsonData={handleSparklesComposition}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Player
              baselineJsonData={baselineData}
              sparklesJsonData={sparklesData}
              onAttackInSecChange={attackInSec}
              onDecayInSecChange={decayInSec}
              onSustainInSecChange={sustainInSec}
              onReleaseInSecChange={releaseInSec}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <SimplePlayer
              baselineJsonData={baselineData}
              sparklesJsonData={sparklesData}
              durationInSeconds={durationInSeconds}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
