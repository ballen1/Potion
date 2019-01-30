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
            Draw.drawText(this.context, ports.inputs[0].name);
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