'use strict';

class Magician {
    constructor(_bpm) {
        this.bpm = _bpm;
        this.stirBound = () => this.stir();
        this.stirrer = undefined;

        this.time = 0;
        this.elapsed = 0;

        this.cauldrons = [];
    }

    begin() {
        this.time = Date.now();
        this.stirrer = setInterval(this.stirBound, (60000 / this.bpm) * 0.1);
    }

    stir() {
        let currentTime = Date.now();
        this.elapsed += (currentTime - this.time);
        this.time = currentTime;

        if (this.elapsed >= (60000 / this.bpm)) {
            this.elapsed = 0;

            for (let cauldron of this.cauldrons) {
                cauldron.bubble();
            }
        }
    }

    addCauldron(cauldron) {
        this.cauldrons.push(cauldron);
    }

};

module.exports = Magician;