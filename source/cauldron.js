'use strict';

class Cauldron {
    constructor(_midi) {
        this.midi = _midi;
    }

    playRandomNote() {
        console.log("Cauldron playRandomNote()");
        let note = Math.random() * 127;
        this.midi.noteOn(note, 0x45);
        this.midi.noteOff(note, 1000);
    }
};

module.exports = Cauldron;