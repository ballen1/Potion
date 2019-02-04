'use strict';

const CAULDRON_WIDTH = 40;
const CAULDRON_HEIGHT = 40;

class Cauldron {
    constructor(_midi, _x = 0, _y = 0) {
        this.midi = _midi;

        this.x = _x;
        this.y = _y;
    }

    get width() {
        return CAULDRON_WIDTH;
    }

    get height() {
        return CAULDRON_HEIGHT;
    }

    playRandomNote() {
        let note = Math.random() * 127;
        this.midi.noteOn(note, 0x45);
        this.midi.noteOff(note, 1000);
    }
};

module.exports = Cauldron;