'use strict';

class Midi {
    constructor() {
        this.output = null;
    }

    getAvailablePorts() {
        return new Promise((resolve, reject) => {
            navigator.requestMIDIAccess()
            .then(access => {
                resolve(this._getPorts(access));
            }, failure => {
                reject(failure);
            }); 
        });
    }

    noteOn(note, channel, octave, velocity) {
        let message = 0x90 + channel;
        this.output.send([message, this._noteToNumber(note, octave), velocity]);
    }

    noteOff(note, channel, octave) {
        let message = 0x90 + channel;
        this.output.send([message, this._noteToNumber(note, octave), 0]);
    }

    _noteToNumber(note, octave = 0) {
        note = note.toUpperCase();
        let octaveShift = octave * 12;
        switch (note) {
            case 'C':
                return 0 + octaveShift;
            case 'C#':
                return 1 + octaveShift;
            case 'D':
                return 2 + octaveShift;
            case 'D#':
                return 3 + octaveShift;
            case 'E':
                return 4 + octaveShift;
            case 'F':
                return 5 + octaveShift;
            case 'F#':
                return 6 + octaveShift;
            case 'G':
                return 7 + octaveShift;
            case 'G#':
                return 8 + octaveShift;
            case 'A':
                return 9 + octaveShift;
            case 'A#':
                return 10 + octaveShift;
            case 'B':
                return 11 + octaveShift;
        }
    }

    _getPorts(midiAccess) {
        let ports = { outputs : []}
        for (let output of midiAccess.outputs.values()) {
            ports.outputs.push(output);
        }
        return ports;
    }
};

module.exports = Midi;