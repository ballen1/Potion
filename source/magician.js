'use strict';

const { circleCollision, distBetweenCircles } = require('./collision');

class Magician {
    constructor(_bpm, _octave = 4, _channel = 0) {
        this.bpm = _bpm;
        this.octave = _octave;
        this.channel = _channel;
        this.running = false;
        this.value = 1;

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
        return this._beatDuration();
    }

    willAcceptCauldron(potentialCauldron) {
        for (let cauldron of this.cauldrons) {
            if (circleCollision(cauldron.boundingCircle, potentialCauldron.boundingCircle)) {
                return false;
            }
        }

        return true;
    }

    addCauldron(cauldron) {
        this.cauldrons.push(cauldron);
    }

    increaseBpm() {
        this.bpm += 1;
        this._updateCauldrons();
    }

    decreaseBpm() {
        this.bpm -= 1;
        this._updateCauldrons()
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

    makeCollisionMapping(cauldron) {
        let mapping = [];
        
        if (cauldron.doesExpand()) {
            let bounds = cauldron.boundingCircle;
            bounds.radius = cauldron.maxExpansionRadius;
            for (let other of this.cauldrons) {
                if (other !== cauldron) {
                    if (other.ingredientSet == 'FilterSet' && circleCollision(bounds, other.boundingCircle)) {
                        let threshold = distBetweenCircles(cauldron.boundingCircle, other.boundingCircle);
                        let collision = { 'cauldron' : other, 'expansionThreshold' : threshold };
                        mapping.push(collision);
                    }
                }
            }
        }
        mapping.sort((a, b) => {
            return a.expansionThreshold >= b.expansionThreshold;
        });

        console.log(mapping);
        return mapping;
    }

    _beatDuration() {
        // The 50ms is to add a bit of buffer, otherwise the notes will just bleed together.
        // Investigate this more in the future to see how this may be improved.
        return (60000 / this.bpm) - 50;
    }

    _updateCauldrons() {
        let newDuration = this._beatDuration();
        for (let cauldron of this.cauldrons) {
            cauldron.updateBeatDuration(newDuration);
        }
    }
};

module.exports = Magician;