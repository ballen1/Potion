class Midi {

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
        let ports = { 'inputs' : [], 'outputs' : []}
        for (let input of midiAccess.inputs.values()) {
            ports.inputs.push({ id: input.id, name: input.name});
        }
        for (let output of midiAccess.outputs.values()) {
            ports.outputs.push({ id: output.id, name: output.name });
        }
        return ports;
    }
};

module.exports = Midi;