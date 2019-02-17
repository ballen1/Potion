'use strict';

class Magician {
    constructor(_bpm, _octave = 4, _channel = 0) {
        this.bpm = _bpm;
        this.octave = _octave;
        this.channel = _channel;
        this.running = false;

        this.stirBound = () => this.stir();
        this.stirrer = undefined;

        this.time = 0;
        this.elapsed = 0;

        this.cauldrons = [];

        this.observers = [];
    }

    start() {
        this.running = true;
        this.time = Date.now();
        this.stirrer = setTimeout(this.stirBound, (60000 / this.bpm) * 0.1);
    }

    stop() {
        this.time = 0;
        this.elapsed = 0;
        this.running = false;
        clearTimeout(this.stirrer);
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

            for (let observer of this.observers) {
                observer();
            }
        }

        if (this.running) {
            this.stirrer = setTimeout(this.stirBound, (60000 / this.bpm) * 0.1);
        }
    }

    addCauldron(cauldron) {
        this.cauldrons.push(cauldron);
    }

    subscribe(callback) {
        this.observers.push(callback);
    }

    increaseBpm() {
        this.bpm += 1;
    }

    decreaseBpm() {
        this.bpm -= 1;
    }

    increaseOctave() {
        if (this.octave < 9) {
            this.octave += 1;
        }
    }

    decreaseOctave() {
        if (this.octave > 0) {
            this.octave -= 1;
        }
    }

    increaseChannel() {
        if (this.channel < 15) {
            this.channel += 1;
        }
    }

    decreaseChannel() {
        if (this.channel > 0) {
            this.channel -= 1;
        }
    }

    get isRunning() {
        return this.running;
    }
};

module.exports = Magician;