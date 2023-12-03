import React from "react";
import OpenAI from "openai";
import { Midi } from "@tonejs/midi";

const MidiComposer = ({ onCompositionComplete }) => {
  const longString = `I need assistance in producing AI-generated text
  that I convert to music using MIDI files. 
  The way I would like you to generate them is as
  follows:
  {
  // the transport and timing data
  header: {
    name: String,                     // the name of the first empty track, 
                                      // which is usually the song name
    tempos: TempoEvent[],             // the tempo, e.g. 120
    timeSignatures: TimeSignatureEvent[],  // the time signature, e.g. [4, 4],
  
    PPQ: Number                       // the Pulses Per Quarter of the midi file
                                      // this is read only
  },
  
  duration: Number,                   // the time until the last note finishes
  
  // an array of midi tracks
  tracks: [
    {
      name: String,                   // the track name if one was given
  
      channel: Number,                // channel
                                      // the ID for this channel; 9 and 10 are
                                      // reserved for percussion
      notes: [
        {
          midi: Number,               // midi number, e.g. 60
          time: Number,               // time in seconds
          ticks: Number,              // time in ticks
          name: String,               // note name, e.g. "C4",
          pitch: String,              // the pitch class, e.g. "C",
          octave : Number,            // the octave, e.g. 4
          velocity: Number,           // normalized 0-1 velocity
          duration: Number,           // duration in seconds between noteOn and noteOff
        }
      ],
  
      // midi control changes
      controlChanges: {
        // if there are control changes in the midi file
        '91': [
          {
            number: Number,           // the cc number
            ticks: Number,            // time in ticks
            time: Number,             // time in seconds
            value: Number,            // normalized 0-1
          }
        ],
      },
  
      instrument: {                   // and object representing the program change events
        number : Number,              // the instrument number 0-127
        family: String,               // the family of instruments, read only.
        name : String,                // the name of the instrument
        percussion: Boolean,          // if the instrument is a percussion instrument
      },          
    }
  ]
  } here is a filled out example: "{
  "header": {
    "keySignatures": [],
    "meta": [],
    "name": "",
    "ppq": 240,
    "tempos": [
      {
        "bpm": 120,
        "ticks": 0
      }
    ],
    "timeSignatures": [
      {
        "ticks": 0,
        "timeSignature": [
          4,
          4
        ],
        "measures": 0
      }
    ]
  },
  "tracks": [
    {
      "channel": 0,
      "controlChanges": {
        "7": [
          {
            "number": 7,
            "ticks": 0,
            "time": 0,
            "value": 1
          }
        ]
      },
      "pitchBends": [],
      "instrument": {
        "family": "bass",
        "number": 33,
        "name": "electric bass (finger)"
      },
      "name": "",
      "notes": [
        {
          "duration": 0.26875,
          "durationTicks": 129,
          "midi": 45,
          "name": "A2",
          "ticks": 0,
          "time": 0,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.2562500000000001,
          "durationTicks": 123,
          "midi": 48,
          "name": "C3",
          "ticks": 360,
          "time": 0.75,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.26875000000000004,
          "durationTicks": 129,
          "midi": 50,
          "name": "D3",
          "ticks": 480,
          "time": 1,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.1333333333333333,
          "durationTicks": 64,
          "midi": 52,
          "name": "E3",
          "ticks": 600,
          "time": 1.25,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.7333333333333334,
          "durationTicks": 352,
          "midi": 45,
          "name": "A2",
          "ticks": 840,
          "time": 1.75,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.4791666666666665,
          "durationTicks": 230,
          "midi": 43,
          "name": "G2",
          "ticks": 1200,
          "time": 2.5,
          "velocity": 0.4881889763779528
        },
        {
          "duration": 0.28125,
          "durationTicks": 135,
          "midi": 45,
          "name": "A2",
          "ticks": 1440,
          "time": 3,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.16041666666666643,
          "durationTicks": 77,
          "midi": 45,
          "name": "A2",
          "ticks": 1920,
          "time": 4,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.16041666666666643,
          "durationTicks": 77,
          "midi": 48,
          "name": "C3",
          "ticks": 2280,
          "time": 4.75,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.25416666666666643,
          "durationTicks": 122,
          "midi": 50,
          "name": "D3",
          "ticks": 2400,
          "time": 5,
          "velocity": 0.7086614173228346
        },
        {
          "duration": 0.2020833333333334,
          "durationTicks": 97,
          "midi": 52,
          "name": "E3",
          "ticks": 2520,
          "time": 5.25,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.760416666666667,
          "durationTicks": 365,
          "midi": 45,
          "name": "A2",
          "ticks": 2760,
          "time": 5.75,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.47916666666666696,
          "durationTicks": 230,
          "midi": 48,
          "name": "C3",
          "ticks": 3120,
          "time": 6.5,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.1875,
          "durationTicks": 90,
          "midi": 45,
          "name": "A2",
          "ticks": 3360,
          "time": 7,
          "velocity": 0.6141732283464567
        }
      ],
      "endOfTrackTicks": 3839
    }
  ]
  }"`;

  const notationExample = `{
  "header": {
    "keySignatures": [],
    "meta": [],
    "name": "",
    "ppq": 240,
    "tempos": [
      {
        "bpm": 120,
        "ticks": 0
      }
    ],
    "timeSignatures": [
      {
        "ticks": 0,
        "timeSignature": [
          4,
          4
        ],
        "measures": 0
      }
    ]
  },
  "tracks": [
    {
      "channel": 0,
      "controlChanges": {
        "7": [
          {
            "number": 7,
            "ticks": 0,
            "time": 0,
            "value": 1
          }
        ]
      },
      "pitchBends": [],
      "instrument": {
        "family": "bass",
        "number": 33,
        "name": "electric bass (finger)"
      },
      "name": "",
      "notes": [
        {
          "duration": 0.26875,
          "durationTicks": 129,
          "midi": 45,
          "name": "A2",
          "ticks": 0,
          "time": 0,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.2562500000000001,
          "durationTicks": 123,
          "midi": 48,
          "name": "C3",
          "ticks": 360,
          "time": 0.75,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.26875000000000004,
          "durationTicks": 129,
          "midi": 50,
          "name": "D3",
          "ticks": 480,
          "time": 1,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.1333333333333333,
          "durationTicks": 64,
          "midi": 52,
          "name": "E3",
          "ticks": 600,
          "time": 1.25,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.7333333333333334,
          "durationTicks": 352,
          "midi": 45,
          "name": "A2",
          "ticks": 840,
          "time": 1.75,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.4791666666666665,
          "durationTicks": 230,
          "midi": 43,
          "name": "G2",
          "ticks": 1200,
          "time": 2.5,
          "velocity": 0.4881889763779528
        },
        {
          "duration": 0.28125,
          "durationTicks": 135,
          "midi": 45,
          "name": "A2",
          "ticks": 1440,
          "time": 3,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.16041666666666643,
          "durationTicks": 77,
          "midi": 45,
          "name": "A2",
          "ticks": 1920,
          "time": 4,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.16041666666666643,
          "durationTicks": 77,
          "midi": 48,
          "name": "C3",
          "ticks": 2280,
          "time": 4.75,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.25416666666666643,
          "durationTicks": 122,
          "midi": 50,
          "name": "D3",
          "ticks": 2400,
          "time": 5,
          "velocity": 0.7086614173228346
        },
        {
          "duration": 0.2020833333333334,
          "durationTicks": 97,
          "midi": 52,
          "name": "E3",
          "ticks": 2520,
          "time": 5.25,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.760416666666667,
          "durationTicks": 365,
          "midi": 45,
          "name": "A2",
          "ticks": 2760,
          "time": 5.75,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.47916666666666696,
          "durationTicks": 230,
          "midi": 48,
          "name": "C3",
          "ticks": 3120,
          "time": 6.5,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.1875,
          "durationTicks": 90,
          "midi": 45,
          "name": "A2",
          "ticks": 3360,
          "time": 7,
          "velocity": 0.6141732283464567
        }
      ],
      "endOfTrackTicks": 3839
    }
  ]
  }`;

  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

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
    try {
      let completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content:
              longString +
              " Please give me a happy melody, without commentary or explanation only the melody.",
          },
        ],
        temperature: 1,
      });

      let output = completion.choices[0]?.message?.content;
      let composition = cleanGPTOutput(output);

      onCompositionComplete(composition);

      console.log(composition);
      console.log("This was the original message: " + output);
    } catch (error) {
      console.error("Error with OpenAI completion:", error);
    }
    //createMidi(gptComposition);
  };

  const testComposeGPT = async () => {
    console.log("GPT composed example loaded...");
    onCompositionComplete(notationExample);
  };

  const createMidi = () => {
    //TODO create Midi file from JSON using tone.js/midi
  };

  return (
    <div>
      <button onClick={testComposeGPT}>Generate Sound</button>
    </div>
  );
};

export default MidiComposer;
