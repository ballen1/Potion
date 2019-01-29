class Midi {
    constructor() {
        navigator.requestMIDIAccess()
        .then( access => {
            this.refreshPorts(access);
        }, failure => {
            console.log("Failured to get MIDI Access.");
        });
    }

    refreshPorts(midiAccess) {
        console.log("Inputs");
        for (let input of midiAccess.inputs.values()) {
            console.log(input);
        }
        
        console.log("Outputs");
        for (let output of midiAccess.outputs.values()) {
            console.log(output);
        }
    }
};

module.exports = Midi;