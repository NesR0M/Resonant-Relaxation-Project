export const longString = `
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

export const notationExample = `{
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

export const prompt =
  `I need assistance in producing AI-generated text that I convert to music using MIDI files to create haptic melodies optimized for whole-body vibration experiences, composing little interesting "sparkles". We are focusing on frequencies between 25-60Hz as a guiding frequency for our "sparkle", that will be played on top. Structure the compositions as follows:

  1. **Note Specification**: Represent each note as a tuple (pitch, duration). Use pitch values corresponding to frequencies in the 25-60Hz range, and durations reflecting musical timing.
  2. **Integration of Silence**: Include silences, denoted by a tuple with pitch 0 and duration signifying the silence length.
  3. **Musical Elements**:
  1. **Preferred Frequencies**: 40-60 Hz are a pleasant range for tactile vibrations, while others argue for 25-40 Hz as most preferred. These frequencies are crucial in creating a haptic melody that is perceived as pleasant and engaging. The baseline that is provided should be within that range. Create in your MIDI harmonic elements for an audioscape corresponding to the baseline frequency for dissonance. 
  2. **Consonance and Dissonance**: The papers extend the concept of consonance and dissonance from music theory to vibrotactile stimuli. Consonant intervals (e.g., octave, perfect fifth) were generally preferred over dissonant ones (e.g., minor second). This suggests that haptic melodies should incorporate intervals and combinations that are harmonically pleasing and stable.
  3. **Individual Variability**: While certain frequencies and intervals may be broadly preferred, there is no one-size-fits-all solution. A range of frequencies and combinations might be necessary to cater to different preferences. Use the frequency provided in the baseline, which we will use as a harmonic basis for the user's preference.
  4. **Rhythmic and Smooth Patterns**: Preferred are non intrusive, rhythmic and smooth patterns in vibrotactile stimuli. Those are typically characterized by slow attacks and releases. You can also play with the velocity and nuances like little rattle patterns. This mirrors musical aesthetics where rhythm plays a crucial role in the structure and appeal of a piece. For rhythmic and reoccuring pattern you also need noticable silence sometimes.
  5. **Resonance and Neural Entrainment**: The concept of resonance, particularly neural resonance, is explored in the context of vibroacoustic therapy and aesthetic experience. This suggests that the frequencies and rhythms chosen for haptic melodies might also align with neural oscillation frequencies to enhance their therapeutic and relaxing effects.
  - **Pitch Range**: Emphasize pitches that align with or build on frequencies found pleasant in vibrotactile studies.
      - **Rhythm and Contour**: Develop rhythms and contours reflecting preferences for smooth, rhythmic patterns. Create slowly moving up and down pattern, comparable to fingerpicking a guitar slowly.
      - **Consonance and Dissonance**: Apply principles of consonance and dissonance, favoring combinations like the octave (1:2) and perfect fifth (2:3). 4. **Output Format**: Present the melody in this format:` +
  longString +
  `
5. **Individual Variability**: Recognize the variation in individual preferences for vibration frequencies.

The goal is to create melodies that are not only musically coherent but also optimized for haptic feedback, based on empirical findings on vibrotactile feedback and human emotional response`;

export const prompt2 = `Objective: Create a sound composition structured as a MIDI file with specific attributes and transformations. The composition is a relaxation waveform lasting for 5 minutes, incorporating frequency modulation and base tone changes.

MIDI File Syntax:
{
  "header": {
    "name": "Relaxation Waveform",
    "tempos": [{"bpm": 120, "ticks": 0}],
    "timeSignatures": [{"ticks": 0, "timeSignature": [4, 4], "measures": 0}],
    "ppq": 240
  },
  "duration": 300,  // Total duration in seconds (5 minutes)
  "tracks": [
    {
      "name": "Modulator Wave",
      "channel": 1,
      "notes": [
        // Define notes representing the frequency modulation from 60 Hz to 42 Hz over 300 seconds
      ],
      "instrument": {"number": 1, "family": "synth", "name": "Modulator Synth"}
    },
    {
      "name": "Carrier Wave",
      "channel": 2,
      "notes": [
        // Define notes representing the carrier wave frequency change from 0.1 Hz to 0.0667 Hz over 300 seconds
      ],
      "instrument": {"number": 2, "family": "synth", "name": "Carrier Synth"}
    }
  ]
}
Here is a another example of the syntax: `+longString+`
Semantic Description of the Sound Composition:

Total Duration: 5 minutes (300 seconds).

Modulator Wave (Frequency Modulation):

Start Frequency: 60 Hz
End Frequency: 42 Hz
Transition: Linear decrease over 300 seconds.
Carrier Wave (Base Tone):

Start Frequency: 0.1 Hz (equivalent to 12 BPM / 2)
End Frequency: 0.0667 Hz (equivalent to 8 BPM / 2)
Transition: Logarithmic decrease over 300 seconds.
Instantaneous Phase Calculation: Calculate the phase of the carrier wave by integrating its frequency over time.

Waveform Generation: Produce the final waveform by multiplying the modulated sine wave (based on the modulator frequency) with the sine of the carrier wave's phase.

Normalization: Normalize the waveform to ensure values are within the range [-1, 1].

Instructions:
Use the provided MIDI file syntax to create a sound composition that matches the described semantic qualities.
Implement the specific frequency transitions for both the modulator and carrier waves.
Ensure the composition adheres to the duration, phase calculation, waveform generation, and normalization criteria outlined.`