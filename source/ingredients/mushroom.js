'use strict';

class Mushroom {
    constructor(_midi, _note, _octave) {
        this.type = 'effect';
        this.midi = _midi;
        this.note = _note;
        this.octave = _octave;

        this.time = 0;
        this.elapsed = 0;

        this.isEmanating = false;
    }

    emanate() {
        this.midi.noteOn(this.note, this.octave, 0x45);
        this.time = Date.now();
        this.isEmanating = true;

        let id = setInterval(() => {
            let currentTime = Date.now();
            this.elapsed += (currentTime - this.time);
            this.time = currentTime;

            if (this.elapsed >= 200) {
                this.midi.noteOff(this.note, this.octave);
                this.elapsed = 0;
                this.isEmanating = false;
                clearInterval(id);
            }
        }, 50)
    }
};

module.exports = Mushroom;