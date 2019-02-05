'use strict';

class Mushroom {
    constructor(_midi, _note) {
        this.type = 'effect';
        this.midi = _midi;
        this.note = _note;
    }

    emanate() {
        this.midi.noteOn(this.note, 0x45);
        this.midi.noteOff(this.note, 50);
    }
};

module.exports = Mushroom;