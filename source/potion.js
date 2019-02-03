'use strict';

const Cauldron = require('./cauldron');
const Draw = require('./draw');
const Midi = require('./midi');
const Input = require('./input');

class Potion {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        document.body.appendChild(this.canvas);

        let midi = new Midi();

        this.cauldrons = [];
        this.cauldrons.push(new Cauldron(midi));

        let drawer = new Draw(this.canvas, midi, this.cauldrons);

        midi.getAvailablePorts()
        .then(ports => {
            if (ports.outputs.length > 0) {
                midi.output = ports.outputs[0];
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