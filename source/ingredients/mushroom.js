'use strict';

class Mushroom {
    constructor(_midi, _note, _channel, _octave, _beatMs) {
        this.type = 'effect';
        this.midi = _midi;
        this.channel = _channel;
        this.note = _note;
        this.octave = _octave;
        this.beatMs = _beatMs;

        this.time = 0;
        this.elapsed = 0;

        this.isEmanating = false;

        this.animal = null;
    }

    emanate() {
        // Right now this could cause a note to be missed
        // TODO: in the future, an interval should be set here to wait for the previous
        // note to finish, and then the note can play (rather than being missed completely)
        if (!this.isEmanating) {
            this.midi.noteOn(this.note, this.channel, this.octave, 0x45);
            this.time = Date.now();
            this.isEmanating = true;

            let noteDuration = this.beatMs;

            if (this.animal) {
                noteDuration = this.animal.duration * this.beatMs;
            }

            let id = setInterval(() => {
                let currentTime = Date.now();
                this.elapsed += (currentTime - this.time);
                this.time = currentTime;

                if (this.elapsed >= noteDuration) {
                    this.midi.noteOff(this.note, this.channel, this.octave);
                    this.elapsed = 0;
                    this.isEmanating = false;
                    clearInterval(id);
                }
            }, 10)
        }
    }
};

module.exports = Mushroom;