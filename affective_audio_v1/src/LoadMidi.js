import React, { useState } from "react";
import { Midi } from "@tonejs/midi";
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const MidiLoader = ({ onCompositionComplete }) => {
  const [file, setFile] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        try {
          const midiData = new Uint8Array(e.target.result);
          const midi = new Midi(midiData);
          const toneJson = midi.toJSON();
          onCompositionComplete(toneJson);
        } catch (error) {
          console.error("Error processing MIDI file:", error);
        }
      };
  
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
  
      reader.readAsArrayBuffer(file);
    }
  };

  const fileData = () => {
    if (file) {
      return (
        <Card bg="dark" text="white" className="mt-3">
          <Card.Body>
            <Card.Title>File Details:</Card.Title>
            <Card.Text>File Name: {file.name}</Card.Text>
            <Card.Text>File Type: {file.type}</Card.Text>
            <Card.Text>Last Modified: {file.lastModifiedDate.toDateString()}</Card.Text>
          </Card.Body>
        </Card>
      );
    }
  };

  return (
    <div>
      <Form>
        <Row className="align-items-center">
          <Col sm={10}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" onChange={onFileChange} accept=".mid,.midi" />
            </Form.Group>
          </Col>
          <Col sm={2}>
            <Button variant="outline-light" onClick={onFileUpload} disabled={!file}>Upload!</Button>
          </Col>
        </Row>
      </Form>
      {fileData()}
    </div>
  );
};

export default MidiLoader;
