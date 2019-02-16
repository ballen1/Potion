'use strict';

const Cauldron = require('./cauldron');
const Draw = require('./draw');
const Magician = require('./magician');
const Midi = require('./midi');
const Ingredients = require('./ingredients');
const Input = require('./input');

class Potion {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1000;
        this.canvas.height = 600;
        document.body.appendChild(this.canvas);
        this.midi = new Midi();
        let magician = new Magician(120);
        magician.begin();
        let drawer = new Draw(this.canvas, this.midi, Ingredients, magician);
        this.canvasMouseX = 0;
        this.canvasMouseY = 0;

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

        this.input.clickHandler = (click) => {
            let xPos = click.clientX;
            let yPos = click.clientY;

            drawer.handleClick(xPos, yPos);
            drawer.drawCanvas();
        };

        this.input.keydownHandler = (key) => {
            if (key == 'a') {
                let coords = drawer.screenToWorldCoords(this.canvasMouseX, this.canvasMouseY);
                magician.addCauldron(new Cauldron(coords.x, coords.y));
                drawer.drawCanvas();
            }
            else if (key == 'Enter') {
                let ingredient = Ingredients.byName(drawer.selectedIngredient);

                let cauldron = drawer.selectedCauldron;

                if (cauldron) {
                    if (ingredient.type === 'emitter') {
                        cauldron.addIngredient(Ingredients.Rock(ingredient));
                    }
                    else if (ingredient.type == 'effect') {
                        cauldron.addIngredient(Ingredients.Mushroom(ingredient, this.midi));
                    }
                }
            }
            else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(key) > -1) {
                drawer.handleDrawerKeyDown(key);
                drawer.drawCanvas();
            }
        };

        this.input.mousemoveHandler = (event) => {
            let rect = this.canvas.getBoundingClientRect();
            this.canvasMouseX = event.pageX - rect.left;
            this.canvasMouseY = event.pageY - rect.top;
        }
    }
};

module.exports = Potion;