import logo from "./logo.svg";
import "./App.css";
import OpenAI from "openai";
import MidiWriter from "https://cdn.skypack.dev/midi-writer-js@2.1.4";

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
Each note is represented as a tuple of two
elements:
The pitch of the note (integer value).
Because I will use this text representation and
convert to MIDI the note should be a number
from 21 (that is note A0 - 27,50 Hz) to 96 (that is
C7 - 2093 hz) so use these numbers to represent
the note.
The duration of the note (float value)
represented as:
0.125 for an eighth note
0.25 for a quarter note
0.5 for a half note
1 for a whole note
2 for a double whole note
But could be any number between 0 and 2,
bocouse you know, musician are creative so why
not 0.29 or 1.22, etc.
With this format i need you generate a text that
i will covert in music in this format:
melody_pitch_duration_data = [[note, duration], [note, duration], [note, duration],etc]
And when there is a silence the note should be 0
and the duration is how long is that silence.
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

const notationExample = `melody_pitch_duration_data = [[60, 0.5], [62, 0.5], [64, 1], [67, 0.5], [65, 0.5], [64, 0.5], [62, 0.5],
[60, 1], [60, 0.5], [62, 0.5], [64, 1], [67, 0.5], [65, 0.5], [64, 0.5],
[62, 0.5], [60, 1],
[60, 0.125], [0, 0.125], [62, 0.125], [0, 0.125], [64, 0.125],
[0, 0.125], [62, 0.125], [0, 0.125], [60, 0.5], [62, 0.5], [64, 0.5],
[67, 1], [60, 0.5], [0, 0.125], [64, 0.125], [0, 0.125], [65, 0.125],
[0, 0.125], [64, 0.125], [62, 1],
[60, 1], [0, 0.5], [60, 0.5], [67, 0.5], [65, 0.5], [64, 0.5],
[67, 0.5], [69, 1], [69, 0.125], [0, 0.125], [67, 0.125], [0, 0.125],
[69, 0.125], [0, 0.125], [67, 0.125], [64, 1]]`;

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

let gptHistory = [];
let gptComposition = [];

function extractMelodyData(message) {
  const melodyStart = "[[";
  const melodyEnd = "]]";

  let startIndex = message.indexOf(melodyStart);
  let endIndex = message.indexOf(melodyEnd, startIndex);

  if (startIndex === -1 || endIndex === -1) {
    console.error("Melody data not found in the message");
    return null;
  }

  // Adjusting endIndex to include the closing characters
  endIndex += melodyEnd.length;

  // Extracting the substring that contains the melody data
  const melodyDataString = message.slice(startIndex, endIndex);

  try {
    // Parsing the string to convert it into an array
    const melodyDataArray = JSON.parse(melodyDataString);
    return melodyDataArray;
  } catch (error) {
    console.error("Error parsing melody data: ", error);
    return null;
  }
}

async function runPrompt() {
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
      gptComposition = extractMelodyData(output);
      console.log(gptComposition);
    }
    console.log("This was the original message: " + output);
    gptHistory = [];
  } catch (error) {
    console.error("Error with OpenAI completion:", error);
  }
  createMidi(gptComposition);
}

function createMidi(melody_pitch_duration_data) {
  // Create a new track
  let track = new MidiWriter.Track();

  // Set track's ticks per beat
  //track.setTicksPerBeat(TICKS_PER_BEAT);
  track.setTempo(BEATS_PER_MINUTE);

  // Add events to the track based on your melody data
  melody_pitch_duration_data.forEach(([note, duration]) => {
    if (note !== 0) {
      // Note on event
      track.addEvent(
        new MidiWriter.NoteEvent({
          pitch: [note],
          duration: "T" + Math.round(duration * TICKS_PER_SECOND),
          velocity: 64,
        }),
        { sequential: true }
      );
    } else {
      // Rest (silence)
      track.addEvent(
        new MidiWriter.NoteEvent({
          rest: true,
          duration: "T" + Math.round(duration * TICKS_PER_SECOND),
        }),
        { sequential: true }
      );
    }
  });

  // Generate a data URI
  let write = new MidiWriter.Writer(track);
  //let dataUri = write.dataUri();
  console.log(write.dataUri());
}

function App() {
  const handleGenerateMidi = () => {
    runPrompt(); // Calling your imported or defined function
  };

  const handlePlayMidi = () => {
    //playSound();
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
