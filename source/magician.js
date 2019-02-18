'use strict';

class Magician {
    constructor(_bpm, _octave = 4, _channel = 0) {
        this.bpm = _bpm;
        this.octave = _octave;
        this.channel = _channel;
        this.running = false;

        this.beatUnit = 4;
        this.beatsPerBar = 4;
        this.beat = -1;

        this.stirBound = () => this.stir();
        this.stirrer = undefined;

        this.time = 0;
        this.elapsed = 0;

        this.cauldrons = [];
    }

    start() {
        this.running = true;
        this.time = Date.now();
        this.stirrer = setTimeout(this.stirBound, (60000 / this.bpm) * 0.1);
    }

    stop() {
        clearTimeout(this.stirrer);
        this.time = 0;
        this.elapsed = 0;
        this.running = false;
        this.beat = -1;
    }

    stir() {
        let currentTime = Date.now();
        this.elapsed += (currentTime - this.time);
        this.time = currentTime;

        if (this.elapsed >= (60000 / this.bpm)) {
            this.beat = (this.beat + 1 ) % this.beatsPerBar;

            this.elapsed = 0;

            for (let cauldron of this.cauldrons) {
                cauldron.bubble(this.beat + 1);
            }
        }

        if (this.running) {
            this.stirrer = setTimeout(this.stirBound, (60000 / this.bpm) * 0.1);
        }
    }

    get currentBeat() {
        return (Math.max(0, this.beat));
    }

    get beatDuration() {
        // The 50ms is to add a bit of buffer, otherwise the notes will just bleed together.
        // Investigate this more in the future to see how this may be improved.
        return (60000 / this.bpm) - 50;
    }

    addCauldron(cauldron) {
        this.cauldrons.push(cauldron);
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