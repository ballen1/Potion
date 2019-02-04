'use strict';

const Cauldron = require('./cauldron');
const Draw = require('./draw');
const Midi = require('./midi');
const Ingredients = require('./ingredients');
const Input = require('./input');

const Rock = require('./ingredients/rock');

class Potion {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        document.body.appendChild(this.canvas);

        this.midi = new Midi();

        this.cauldrons = [];
        this.cauldrons.push(new Cauldron(this.midi, 200, 200));
        this.cauldrons[0].addIngredient(new Rock(1000));

        let drawer = new Draw(this.canvas, this.midi, this.cauldrons, Ingredients);

        this.midi.getAvailablePorts()
        .then(ports => {
            if (ports.outputs.length > 0) {
                this.midi.output = ports.outputs[0];
                drawer.drawCanvas();
            }
        }, failure => {
            console.log(failure);
        });
        
        this.input = new Input(this.canvas);

        this.input.clickHandler = () => {
            this.cauldrons[0].playRandomNote();
        };

        this.input.keydownHandler = (key) => {
            console.log(key);
        };
    }
};

module.exports = Potion;