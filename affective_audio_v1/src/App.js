import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import SimplePlayer from "./SimplePlayer";
import RampingPlayer from "./RampingPlayer";
import MidiLoader from "./LoadMidi";
import BaselineComposer from "./BaselineComposer";
import SparkleComposer from "./SparkleComposer";

import { Container, Row, Col, Navbar, Alert } from "react-bootstrap";

function App() {
  const [baselineData, setBaselineData] = useState(null);
  const [error, setError] = useState(null);
  const [sparklesData, setSparklesData] = useState(null);

  const [startFrequency, setStartFrequency] = useState(null);
  const [endFrequency, setEndFrequency] = useState(null);
  const [startBPM, setStartBPM] = useState(null);
  const [endBPM, setEndBPM] = useState(null);
  const [durationInSeconds, setDurationInSeconds] = useState(null);

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
              onEndFrequencyChange={setEndFrequency}
              onStartBPMChange={setStartBPM}
              onEndBPMChange={setEndBPM}
              onDurationInSecondsChange={setDurationInSeconds}
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
            <RampingPlayer
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
