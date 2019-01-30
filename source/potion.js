'use strict';

const Cauldron = require('./cauldron');
const Draw = require('./draw');
const Midi = require('./midi');
const Input = require('./input');

class Potion {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1440;
        this.canvas.height = 1080;        
        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = "red";
        this.context.fillRect(400, 400, 100, 100);

        let midi = new Midi();

        midi.getAvailablePorts()
        .then(ports => {
            if (ports.outputs.length > 0) {
                midi.output = ports.outputs[0];
                Draw.drawText(this.context, midi.output.name, 10, 15);
            }
        }, failure => {
            console.log(failure);
        });

        let testCauldron = new Cauldron();

        this.input = new Input(this.canvas);
        this.input.clickHandler = () => {
            testCauldron.playRandomNote();
        };
    }
};

module.exports = Potion;