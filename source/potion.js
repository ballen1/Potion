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
        this.canvas.width = 1200;
        this.canvas.height = 700;
        document.body.appendChild(this.canvas);

        this.midi = new Midi();
        let magician = new Magician(200);
        
        let drawer = new Draw(this.canvas, this.midi, Ingredients, magician);
        this.canvasMouseX = 0;
        this.canvasMouseY = 0;

        this.input = new Input(this.canvas);

        this.input.clickHandler = (click) => {
            let xPos = click.clientX;
            let yPos = click.clientY;

            drawer.handleClick(xPos, yPos);
        };

        this.input.keydownHandler = (key) => {
            if (key == 'a') {
                let x = this.canvasMouseX;
                let y = this.canvasMouseY;

                if (drawer.isInWorldRegion(x, y)) {
                    let coords = drawer.screenToWorldCoords(x, y);
                    let potentialCauldron = new Cauldron(coords.x, coords.y);

                    if (magician.willAcceptCauldron(potentialCauldron)) {
                        magician.addCauldron(new Cauldron(coords.x, coords.y));
                    }
                }
            }
            else if (key == ']') {
                magician.increaseOctave();
            }
            else if (key == '[') {
                magician.decreaseOctave();
            }
            else if (key == '+') {
                magician.increaseBpm();
            }
            else if (key == '-') {
                magician.decreaseBpm();
            }
            else if (key == '}') {
                magician.increaseChannel();
            }
            else if (key == '{') {
                magician.decreaseChannel();
            }
            else if (key == ' ') {
                if (magician.isRunning) {
                    magician.stop();
                }
                else {
                    magician.start();
                }
            }
            else if (key == 'Enter') {
                let ingredient = Ingredients.byName(drawer.selectedIngredient);

                let cauldron = drawer.selectedCauldron;

                if (cauldron) {
                    if (ingredient.type === 'emitter') {
                        cauldron.addIngredient(Ingredients.Rock(ingredient));
                    }
                    else if (ingredient.type == 'effect') {
                        cauldron.addIngredient(Ingredients.Mushroom(this.midi, ingredient, magician.channel, magician.octave, magician.beatDuration));
                    }
                    else if (ingredient.type == 'length') {
                        cauldron.addIngredient(Ingredients.Animal(ingredient));
                    }
                    else if (ingredient.type == 'value') {
                        cauldron.addIngredient(Ingredients.Crystal(ingredient, magician.value));
                    }
                }
            }
            else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Tab'].indexOf(key) > -1) {
                drawer.handleDrawerKeyDown(key);
            }
            else if (!isNaN(key)) {
                drawer.handleDrawerKeyDown(key);
            }
        };

        this.input.mousemoveHandler = (event) => {
            let rect = this.canvas.getBoundingClientRect();
            this.canvasMouseX = event.pageX - rect.left;
            this.canvasMouseY = event.pageY - rect.top;
        }

        this.midi.getAvailablePorts()
        .then(ports => {
            if (ports.outputs.length > 0) {
                this.midi.output = ports.outputs[0];
                drawer.drawCanvas();
                magician.start();
                this.input.ready();

                // Draw at 30 fps
                setInterval(() => {
                    drawer.drawCanvas();
                }, 33);
            }
        }, failure => {
            console.log(failure);
        });
    }
};

module.exports = Potion;