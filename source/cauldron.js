'use strict';

const CAULDRON_RADIUS = 20;

class Cauldron {
    constructor(_x = 0, _y = 0) {
        this.x = _x;
        this.y = _y;

        this.emitter = null;
        this.effect = null;
        this.length = null;
    }

    get radius() {
        return CAULDRON_RADIUS;
    }

    get boundingBox() {
        let b = {
            x: this.x - CAULDRON_RADIUS,
            y: this.y - CAULDRON_RADIUS,
            w: CAULDRON_RADIUS * 2,
            h: CAULDRON_RADIUS * 2
        }
        return b;
    }

    addIngredient(ingredient) {
        if (ingredient.type === 'emitter') {
            this.emitter = ingredient;
        }
        else if (ingredient.type === 'effect') {
            this.effect = ingredient;
            this.effect.animal = this.length;
        }
        else if (ingredient.type === 'length') {
            this.length = ingredient;
            if (this.effect) {
                this.effect.animal = this.length;
            }
        }

        if (this.emitter && this.effect) {
            this.emitter.signal = this.effect.emanate.bind(this.effect);
        }
    }

    bubble(beat) {
        if (this.emitter) {
            this.emitter.brew(beat);
        }
    }

    isActive() {
        if (this.effect) {
            return this.effect.isEmanating;
        }
    }

    updateBeatDuration(newDuration) {
        if (this.effect) {
            this.effect.beatMs = newDuration;
        }
    }
};

module.exports = Cauldron;