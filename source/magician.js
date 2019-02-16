'use strict';

class Magician {
    constructor(_bpm) {
        this.bpm = _bpm;
        this.stirBound = () => this.stir();
        this.stirrer = undefined;

        this.time = 0;
        this.elapsed = 0;
    }

    begin() {
        this.time = Date.now();
        this.stirrer = setInterval(this.stirBound, (60000 / this.bpm) * 0.1);
    }

    stir() {
        let currentTime = Date.now();
        this.elapsed += (currentTime - this.time);

        if (this.elapsed >= (60000 / this.bpm)) {
            console.log("Stirrr!!!");
            this.elapsed = 0;
        }

        this.time = currentTime;
    }
};

module.exports = Magician;