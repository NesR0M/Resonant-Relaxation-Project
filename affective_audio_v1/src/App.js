import logo from "./logo.svg";
import "./App.css";
import OpenAI from "openai";
import * as Tone from "tone";
import { Midi } from "@tonejs/midi";

// Constants
const TICKS_PER_BEAT = 480; // Standard for most DAWs
const BEATS_PER_MINUTE = 120; // Tempo
const SECONDS_PER_MINUTE = 60;
const TICKS_PER_SECOND =
  (TICKS_PER_BEAT * BEATS_PER_MINUTE) / SECONDS_PER_MINUTE;

const longString = `I need assistance in producing AI-generated text
that I convert to music using MIDI files. Initially,
I'll provide a description of the format I need for
the textual representation of the music.
Since music is a time-based art form,
the notes follow each other in time, and
sometimes there are no notes, that is, silences.
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
    "ppq": 128,
    "tempos": [
      {
        "bpm": 120,
        "ticks": 0
      }
    ],
    "timeSignatures": []
  },
  "tracks": [
    {
      "channel": 0,
      "controlChanges": {},
      "pitchBends": [],
      "instrument": {
        "family": "piano",
        "number": 0,
        "name": "acoustic grand piano"
      },
      "name": "",
      "notes": [
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 60,
          "name": "C4",
          "ticks": 0,
          "time": 0,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 62,
          "name": "D4",
          "ticks": 240,
          "time": 0.9375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 64,
          "name": "E4",
          "ticks": 480,
          "time": 1.875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 65,
          "name": "F4",
          "ticks": 960,
          "time": 3.75,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 1440,
          "time": 5.625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 1920,
          "time": 7.5,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 71,
          "name": "B4",
          "ticks": 2400,
          "time": 9.375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 3.75,
          "durationTicks": 960,
          "midi": 72,
          "name": "C5",
          "ticks": 2880,
          "time": 11.25,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 72,
          "name": "C5",
          "ticks": 3840,
          "time": 15,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 71,
          "name": "B4",
          "ticks": 4320,
          "time": 16.875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 4800,
          "time": 18.75,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 5280,
          "time": 20.625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 5760,
          "time": 22.5,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 6240,
          "time": 24.375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 65,
          "name": "F4",
          "ticks": 6720,
          "time": 26.25,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 64,
          "name": "E4",
          "ticks": 7200,
          "time": 28.125,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 62,
          "name": "D4",
          "ticks": 7680,
          "time": 30,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 3.75,
          "durationTicks": 960,
          "midi": 60,
          "name": "C4",
          "ticks": 8160,
          "time": 31.875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 0,
          "name": "C-1",
          "ticks": 9120,
          "time": 35.625,
          "velocity": 0.5039370078740157
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 60,
          "name": "C4",
          "ticks": 9360,
          "time": 36.5625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 62,
          "name": "D4",
          "ticks": 9600,
          "time": 37.5,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 64,
          "name": "E4",
          "ticks": 9840,
          "time": 38.4375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 65,
          "name": "F4",
          "ticks": 10320,
          "time": 40.3125,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 10800,
          "time": 42.1875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 11280,
          "time": 44.0625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 70,
          "name": "A#4",
          "ticks": 11760,
          "time": 45.9375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 12240,
          "time": 47.8125,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 12720,
          "time": 49.6875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 65,
          "name": "F4",
          "ticks": 13200,
          "time": 51.5625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 64,
          "name": "E4",
          "ticks": 13680,
          "time": 53.4375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 62,
          "name": "D4",
          "ticks": 13920,
          "time": 54.375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 3.75,
          "durationTicks": 960,
          "midi": 60,
          "name": "C4",
          "ticks": 14160,
          "time": 55.3125,
          "velocity": 0.6377952755905512
        }
      ],
      "endOfTrackTicks": 15120
    }
  ]
}"
A melody is a linear sequence of notes that the
listener hears as a single entity. It is the
foreground to the backing elements and is a
combination of pitch and rhythm. Sequences of
notes that comprise melody are musically
satisfying and are often the most memorable
part of a song.
There are many ways to describe a melody. Here
are a few:
● Pitch: The pitch of a melody is the relative
highness or lowness of the notes. Melodies
can be high, low, or somewhere in between.
● Rhythm: The rhythm of a melody is the
pattern of long and short notes. Melodies can
have a slow, steady rhythm, a fast,
syncopated rhythm, or something in
between.
● Intervals: Intervals are the distance between
notes. Melodies can use a variety of
intervals, from small steps to large leaps.
● Contour: The contour of a melody is the
overall shape of the melody. Melodies can be
ascending, descending, or something in
between.
● Tonal center: The tonal center of a melody is
the note that the melody feels like it is
centered around. Melodies can have a strong
tonal center, a weak tonal center, or no tonal
center at all.
When describing a melody, it is important to
consider all of these factors. The pitch, rhythm,
intervals, contour, and tonal center all
contribute to the overall sound of the melody.
Here are some examples of how to describe
melodies:
● The melody of "Happy Birthday" is simple and
repetitive, with a clear tonal center.
● The melody of "Yesterday" by The Beatles is
more complex, with a variety of intervals and
a changing tonal center.
● The melody of "Bohemian Rhapsody" by
Queen is highly dramatic, with a wide range
of pitches and rhythms.
Quality melodies typically limit their range to
about an octave-and-a-half, feature repeating
elements like melodic intervals and rhythmic
patterns, and consist of stepwise motion with
occasional energetic leaps. Good melodies also
interact meaningfully with the bass line,
employing a mix of parallel, similar, oblique, or
contrary motions for a dynamic, counter melodic
effect. Finally, a standout melody tends to have
a climactic moment, often a high note with
significant harmonization and strong rhythmic
placement, which then descends to a restful
cadence.
No matter how it is described, a melody is one of
the most important elements of music. It is what
gives a song its identity and makes it memorable.
Please note that AI-generated music may not
sound pleasing as it is randomly generated so we
will use music theory but not random math so
don't randomize the generation process. take
into account musical concepts like scales,
modes, etc.
Now that you have a full understanding of the
text representation, we will create some
awesome music!
Are you ready to start generating music?
If so, respond with "YES" and nothing else.`;

const notationExample = `{
  "header": {
    "keySignatures": [],
    "meta": [],
    "name": "",
    "ppq": 128,
    "tempos": [
      {
        "bpm": 120,
        "ticks": 0
      }
    ],
    "timeSignatures": []
  },
  "tracks": [
    {
      "channel": 0,
      "controlChanges": {},
      "pitchBends": [],
      "instrument": {
        "family": "piano",
        "number": 0,
        "name": "acoustic grand piano"
      },
      "name": "",
      "notes": [
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 60,
          "name": "C4",
          "ticks": 0,
          "time": 0,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 62,
          "name": "D4",
          "ticks": 240,
          "time": 0.9375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 64,
          "name": "E4",
          "ticks": 480,
          "time": 1.875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 65,
          "name": "F4",
          "ticks": 960,
          "time": 3.75,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 1440,
          "time": 5.625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 1920,
          "time": 7.5,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 71,
          "name": "B4",
          "ticks": 2400,
          "time": 9.375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 3.75,
          "durationTicks": 960,
          "midi": 72,
          "name": "C5",
          "ticks": 2880,
          "time": 11.25,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 72,
          "name": "C5",
          "ticks": 3840,
          "time": 15,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 71,
          "name": "B4",
          "ticks": 4320,
          "time": 16.875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 4800,
          "time": 18.75,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 5280,
          "time": 20.625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 5760,
          "time": 22.5,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 6240,
          "time": 24.375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 65,
          "name": "F4",
          "ticks": 6720,
          "time": 26.25,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 64,
          "name": "E4",
          "ticks": 7200,
          "time": 28.125,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 62,
          "name": "D4",
          "ticks": 7680,
          "time": 30,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 3.75,
          "durationTicks": 960,
          "midi": 60,
          "name": "C4",
          "ticks": 8160,
          "time": 31.875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 0,
          "name": "C-1",
          "ticks": 9120,
          "time": 35.625,
          "velocity": 0.5039370078740157
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 60,
          "name": "C4",
          "ticks": 9360,
          "time": 36.5625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 62,
          "name": "D4",
          "ticks": 9600,
          "time": 37.5,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 64,
          "name": "E4",
          "ticks": 9840,
          "time": 38.4375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 65,
          "name": "F4",
          "ticks": 10320,
          "time": 40.3125,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 10800,
          "time": 42.1875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 11280,
          "time": 44.0625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 70,
          "name": "A#4",
          "ticks": 11760,
          "time": 45.9375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 69,
          "name": "A4",
          "ticks": 12240,
          "time": 47.8125,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 67,
          "name": "G4",
          "ticks": 12720,
          "time": 49.6875,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 1.875,
          "durationTicks": 480,
          "midi": 65,
          "name": "F4",
          "ticks": 13200,
          "time": 51.5625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 64,
          "name": "E4",
          "ticks": 13680,
          "time": 53.4375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.9375,
          "durationTicks": 240,
          "midi": 62,
          "name": "D4",
          "ticks": 13920,
          "time": 54.375,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 3.75,
          "durationTicks": 960,
          "midi": 60,
          "name": "C4",
          "ticks": 14160,
          "time": 55.3125,
          "velocity": 0.6377952755905512
        }
      ],
      "endOfTrackTicks": 15120
    }
  ]
}`;

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

let gptHistory = [];
let gptComposition = [];

function cleanGPTOutput(inputString) {
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
}

function createMidi() {
  //TODO create Midi file from JSON using tone.js/midi
}

function playSound() {}

async function composeGPT() {
  try {
    if (gptHistory.length === 0) {
      gptHistory.push({ role: "user", content: longString });
    }

    let completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: gptHistory,
      temperature: 1,
    });

    let output = completion.choices[0]?.message?.content;

    if (output === "YES") {
      console.log("gpt understood, we are prompting...");
      gptHistory.push({ role: "assistant", content: output });
      gptHistory.push({
        role: "user",
        content:
          "Please give me a happy melody, without commentary or explanation only the melody. In a notion that looks like this: " +
          notationExample,
      });

      completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: gptHistory,
        temperature: 1,
      });

      output = completion.choices[0]?.message?.content;
      gptComposition = cleanGPTOutput(output);
      console.log(gptComposition);
    }
    console.log("This was the original message: " + output);
    gptHistory = [];
  } catch (error) {
    console.error("Error with OpenAI completion:", error);
  }
  //createMidi(gptComposition);
}

function App() {
  const handleGenerateMidi = () => {
    composeGPT();
  };

  const handlePlayMidi = () => {
    playSound();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button id="generateButton" onClick={handleGenerateMidi}>
          Generate Midi
        </button>
        <button id="playButton" onClick={handlePlayMidi}>
          Play Midi
        </button>
      </header>
    </div>
  );
}

export default App;
