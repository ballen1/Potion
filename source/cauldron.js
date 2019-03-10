'use strict';

const CAULDRON_RADIUS = 20;

class Cauldron {
    constructor(_x = 0, _y = 0) {
        this.x = _x;
        this.y = _y;

        // Need to eventually introduce the idea of an "ingredient set".
        // E.g. cannot have both an emitter and a liquid. If you have an emitter
        // and then add a liquid, you effectively have changed the entire operation
        // and opened up a different mode of cauldron functioning.
        // This needs to eventually be abstracted into the idea of the "ingredient set"
        // Don't have time for that yet. Gotta get stuff working first.
        // For now, a string will suffice to differentiate sets

        this.ingredientSet = 'None';

        this.emitter = null;
        this.liquid = null;

        this.effect = null;
        this.length = null;
        this.crystal = null;
    }

    get radius() {
        return CAULDRON_RADIUS;
    }

    get boundingCircle() {
        let circle = {
            x : this.x,
            y : this.y,
            radius : CAULDRON_RADIUS
        };

        return circle;
    }

    addIngredient(ingredient) {
        if (ingredient.type === 'emitter') {
            this.emitter = ingredient;
            this.ingredientSet = 'EmitterSet';
            this.liquid = null;
        }
        else if (ingredient.type === 'filter') {
            this.liquid = ingredient;
            this.ingredientSet = 'FilterSet';
            this.emitter = null;
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
        else if (ingredient.type === 'value') {
            this.crystal = ingredient;
        }

        if (this.emitter && this.effect) {
            this.emitter.signal = this.effect.emanate.bind(this.effect);
        }

        if (this.emitter && this.crystal) {
            this.emitter.applyValue(this.crystal.value);
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

    doesExpand() {
        if (this.emitter) {
            return true;
        }
        else {
            return false;
        }
    }

    isExpanding() {
        if (this.emitter) {
            return this.emitter.expanding;
        }
        else {
            return false;
        }
    }

    get expansionRadius() {
        return (this.radius + this.emitter.currentExpansion);
    }

    get maxExpansionRadius() {
        return (this.radius + this.emitter.maxExpansion);
    }
};

module.exports = Cauldron;