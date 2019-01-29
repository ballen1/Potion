'use strict';

class Cauldron {
    constructor() {

    }

    playRandomNote() {
        console.log("Cauldron playRandomNote()");
        navigator.requestMIDIAccess()
        .then(function(access) {
            const outputs = access.outputs.values();
            let first_output = outputs.next().value;
            let note = Math.random() * 127;
            first_output.send(new Uint8Array([0x90, note, 0x45]));
            setTimeout(() => {first_output.send(new Uint8Array([0x90, note, 0x00]))}, 1000);
        });
    }
};

module.exports = Cauldron;