import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

const APIKeyInput = ({ onSave }) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (apiKey) {
      onSave(apiKey);
    } else {
      setError("Please enter a valid API key.");
    }
  };

  return (
    <Card bg="dark" text="white" className="mb-3">
      <Card.Body>
        <Form>
          <Row className="align-items-center">
            <Col xs={10}>
              <Form.Control 
                type="text" 
                placeholder="Enter OpenAI API Key" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)} 
              />
            </Col>
            <Col xs={2}>
              <Button variant="outline-light" onClick={handleSave}>
                Save Key
              </Button>
            </Col>
          </Row>
          {error && (
            <Row>
              <Col>
                <Alert variant="danger">{error}</Alert>
              </Col>
            </Row>
          )}
        </Form>
      </Card.Body>
    </Card>
  );  
};

export default APIKeyInput;
