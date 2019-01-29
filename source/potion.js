'use strict';

const Input = require('./input');
const Cauldron = require('./cauldron');

class Potion {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1440;
        this.canvas.height = 1080;        
        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = "red";
        this.context.fillRect(400, 400, 100, 100);

        let testCauldron = new Cauldron();

        this.input = new Input(this.canvas);
        this.input.clickHandler = () => {
            testCauldron.playRandomNote();
        };
    }
};

module.exports = Potion;