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

    _getPorts(midiAccess) {
        let ports = { outputs : []}
        for (let output of midiAccess.outputs.values()) {
            ports.outputs.push(output);
        }
        return ports;
    }
};

module.exports = Midi;