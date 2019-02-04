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

    noteOn(note, velocity, delay = 0) {
        setTimeout(() => {
            this.output.send([0x90, note, velocity]);
        }, delay);
    }

    noteOff(note, delay = 0) {
        setTimeout(() => {
            this.output.send([0x90, note, 0]);
        }, delay);
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