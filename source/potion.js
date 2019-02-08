'use strict';

const Cauldron = require('./cauldron');
const Draw = require('./draw');
const Midi = require('./midi');
const Ingredients = require('./ingredients');
const Input = require('./input');

class Potion {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        document.body.appendChild(this.canvas);
        this.midi = new Midi();
        this.cauldrons = [];
        let drawer = new Draw(this.canvas, this.midi, this.cauldrons, Ingredients);
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

        this.input.clickHandler = () => {
            console.log('Click');
        };

        this.input.keydownHandler = (key) => {
            if (key == 'a') {
                this.cauldrons.push(new Cauldron(this.canvasMouseX, this.canvasMouseY));
                drawer.drawCanvas();
            }
            else if (key == 'Enter') {
                let ingredient = Ingredients.emitters.find((obj) => {
                    return obj.name === drawer.selectedIngredient;
                });

                // Change this to only add to a selected cauldron
                for (let cauldron of this.cauldrons) {
                    cauldron.addIngredient(Ingredients.Rock(ingredient));
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