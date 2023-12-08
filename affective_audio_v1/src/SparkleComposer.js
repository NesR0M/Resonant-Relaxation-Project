import React from "react";
import OpenAI from "openai";
import { prompt3 } from "./prompts";
import { createMidi } from './midiUtils';

import { Form, Button, Card, Row, Col } from 'react-bootstrap';

// Initialize OpenAI only if the API key is available
let openai;
if (process.env.REACT_APP_OPENAI_KEY) {
  openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });
} else {
  console.error("OpenAI API key is not defined.");
}

const SparkleComposer = ({ baselineJsonData, sparklesJsonData }) => {
  const cleanGPTOutput = (inputString) => {
    let startIndex = inputString.indexOf("{");
    let braceCount = 0;
    let endIndex = startIndex;

    if (startIndex === -1) {
      console.error("JSON data not found in the message");
      return null;
    }

    while (endIndex < inputString.length) {
      if (inputString[endIndex] === "{") {
        braceCount++;
      } else if (inputString[endIndex] === "}") {
        braceCount--;
        if (braceCount === 0) {
          break;
        }
      }
      endIndex++;
    }

    if (braceCount !== 0) {
      console.error("Incomplete JSON data");
      return null;
    }

    return inputString.substring(startIndex, endIndex + 1);
  };

  const composeGPT = async () => {
    if (!openai) {
      console.error("OpenAI instance is not initialized.");
      return;
    }

    console.log("gpt is composing...");
    try {
      let completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt3 + "This is the baseline and you compose a melody to that:" + baselineJsonData+ "Give me only the MIDI File Syntax nothing else.",
          },
        ],
        temperature: 1,
      });

      let output = completion.choices[0]?.message?.content;
      if (!output) {
        console.error("No output received from OpenAI.");
        return;
      }
      console.log("This was the original message: " + output);

      let composition = cleanGPTOutput(output);
      if (!composition) {
        console.error("Invalid or incomplete JSON data received.");
        return;
      }
      console.log(composition);

      try {
        const midiJsonData = JSON.parse(composition);
        sparklesJsonData(midiJsonData);
        createMidi(midiJsonData);
      } catch (jsonError) {
        console.error("Error parsing JSON data: ", jsonError);
      }

    } catch (error) {
      console.error("Error with OpenAI completion:", error);
    }
  };

  return (
    <Card bg="dark" text="white" className="mb-3">
      <Card.Body>
        <Card.Title style={{ textAlign: 'left', fontWeight: 'bold' }}>sparklesJsonData Composer</Card.Title>
        <Form>
          <Button variant="outline-light" onClick={composeGPT}>Generate sparklesJsonData</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SparkleComposer;
