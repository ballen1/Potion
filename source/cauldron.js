'use strict';

const CAULDRON_WIDTH = 40;
const CAULDRON_HEIGHT = 40;

class Cauldron {
    constructor(_midi, _x = 0, _y = 0) {
        this.midi = _midi;

        this.x = _x;
        this.y = _y;

        this.emitter = null;
        this.effect = null;
    }

    get width() {
        return CAULDRON_WIDTH;
    }

    get height() {
        return CAULDRON_HEIGHT;
    }

    addIngredient(ingredient) {
        if (ingredient.type === 'emitter') {
            this.emitter = ingredient;
        }
        else if (ingredient.type == 'effect') {
            this.effect = ingredient;
        }

        if (this.emitter && this.effect) {
            this.emitter.signal = this.effect.emanate.bind(this.effect);
            this.emitter.brew();
        }
    }
};

module.exports = Cauldron;