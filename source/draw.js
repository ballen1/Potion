'use strict';

const CONTROL_PANEL_X = 10;
const CONTROL_PANEL_Y = 10;
const CONTROL_PANEL_WIDTH = 780;
const CONTROL_PANEL_HEIGHT = 30;

const MIDI_OUTPUT_X = CONTROL_PANEL_X + 10;
const MIDI_OUTPUT_Y = CONTROL_PANEL_Y + 20;

const MAIN_PANEL_X = CONTROL_PANEL_X;
const MAIN_PANEL_Y = CONTROL_PANEL_Y + CONTROL_PANEL_HEIGHT + 10;
const MAIN_PANEL_WIDTH = CONTROL_PANEL_WIDTH;
const MAIN_PANEL_HEIGHT = 400;

const INGREDIENTS_PANEL_X = MAIN_PANEL_X;
const INGREDIENTS_PANEL_Y = MAIN_PANEL_Y + MAIN_PANEL_HEIGHT + 10;
const INGREDIENTS_WIDTH = MAIN_PANEL_WIDTH;
const INGREDIENTS_HEIGHT = 130;

const INGREDIENT_WIDTH = 20;
const INGREDIENT_HEIGHT = 20;
const INGREDIENT_NAME_BUFFER = 20;
const INGREDIENT_HORIZONTAL_SEPARATION = INGREDIENT_WIDTH * 4;
const INGREDIENT_VERTICAL_SEPARATION = INGREDIENT_HEIGHT + 25;

const CAULDRON_HIGHLIGHT_BORDER_WIDTH = 10;

class Draw {
    constructor(_canvas, _midi, _cauldrons, _ingredients) {
        this.canvas = _canvas;
        this.context = this.canvas.getContext('2d');
        this.midi = _midi;
        this.cauldrons = _cauldrons;
        this.ingredients = _ingredients;

        this.context.font = '14px monospace';

        this.selectedIngredient = this.ingredients.all[0].name;
        this.selectedCauldron = null;
    }

    drawCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._drawBox(CONTROL_PANEL_X, CONTROL_PANEL_Y,
            CONTROL_PANEL_WIDTH, CONTROL_PANEL_HEIGHT);
        this._drawBox(MAIN_PANEL_X, MAIN_PANEL_Y,
            MAIN_PANEL_WIDTH, MAIN_PANEL_HEIGHT);
        this._drawBox(INGREDIENTS_PANEL_X, INGREDIENTS_PANEL_Y,
            INGREDIENTS_WIDTH, INGREDIENTS_HEIGHT);
        this._drawText(this.midi.output.name, MIDI_OUTPUT_X, MIDI_OUTPUT_Y);

        const prevStrokeStyle = this.context.strokeStyle;
        const prevFillStyle = this.context.fillStyle;

        this.context.fillStyle = 'green';

        for (let cauldron of this.cauldrons) {
            let coords = this.worldToScreenCoords(cauldron.x, cauldron.y);

            if (cauldron === this.selectedCauldron) {
                this.context.fillStyle = 'black';
                this._drawCircle(coords.x, coords.y, cauldron.radius + CAULDRON_HIGHLIGHT_BORDER_WIDTH);
            }

            this.context.fillStyle = 'green';

            this._drawCircle(coords.x, coords.y, cauldron.radius);
        }

        let xPos = INGREDIENTS_PANEL_X + 20;
        let yPos = INGREDIENTS_PANEL_Y + 15;

        this._drawIngredientRow(this.ingredients.ofType('emitter'), xPos, yPos, 'red');

        xPos = INGREDIENTS_PANEL_X + 20;
        yPos += INGREDIENT_HEIGHT + INGREDIENT_VERTICAL_SEPARATION;

        this._drawIngredientRow(this.ingredients.ofType('effect'), xPos, yPos, 'blue');

        this.context.strokeStyle = prevStrokeStyle;
        this.context.fillStyle = prevFillStyle;
    }

    handleDrawerKeyDown(key) {
        if (key == 'ArrowRight') {
            let ingredient = this.ingredients.byName(this.selectedIngredient);
            let ingredients = this.ingredients.ofType(ingredient.type);

            let index = ingredients.findIndex((ingredient) => {
                return this.selectedIngredient === ingredient.name;
            });

            this.selectedIngredient = ingredients[(index + 1) % ingredients.length].name;
        }
        else if (key == 'ArrowLeft') {
            let ingredient = this.ingredients.byName(this.selectedIngredient);
            let ingredients = this.ingredients.ofType(ingredient.type);

            let index = ingredients.findIndex((ingredient) => {
                return this.selectedIngredient === ingredient.name;
            });

            this.selectedIngredient = ingredients[(index - 1 + ingredients.length) % ingredients.length].name;
        }
        else if (key == 'ArrowUp') {
            let selection = this.ingredients.byName(this.selectedIngredient);

            let index = this.ingredients.all.findIndex((ingredient) => {
                return this.selectedIngredient === ingredient.name;
            });

            index = (index - 1 + this.ingredients.all.length) % this.ingredients.all.length;

            while (selection.type === this.ingredients.all[index].type) {
                index = (index - 1 + this.ingredients.all.length) % this.ingredients.all.length;
            }

            this.selectedIngredient = this.ingredients.all[index].name;
        }
        else if (key == 'ArrowDown') {
            let selection = this.ingredients.byName(this.selectedIngredient);
            
            let index = this.ingredients.all.findIndex((ingredient) => {
                return this.selectedIngredient === ingredient.name;
            });

            index = (index + 1) % this.ingredients.all.length;

            while (selection.type === this.ingredients.all[index].type) {
                index = (index + 1) % this.ingredients.all.length;
            }

            this.selectedIngredient = this.ingredients.all[index].name;
        }
    }

    handleClick(x, y) {
        if (this._isPointInRect(MAIN_PANEL_X, MAIN_PANEL_Y,
            MAIN_PANEL_WIDTH, MAIN_PANEL_HEIGHT,
            x, y)) {
            let coords = this.screenToWorldCoords(x, y);
            for (let cauldron of this.cauldrons) {
                let bounds = cauldron.boundingBox;
                if (this._isPointInRect(bounds.x, bounds.y,
                    bounds.w, bounds.h, coords.x, coords.y)) {
                    this.selectedCauldron = cauldron;
                    break;
                }
            }
        }
    }

    screenToWorldCoords(x, y) {
        return {
            x: x - MAIN_PANEL_X,
            y: y - MAIN_PANEL_Y
        }
    }

    worldToScreenCoords(x, y) {
        return {
            x: x + MAIN_PANEL_X,
            y: y + MAIN_PANEL_Y
        }
    }

    _drawText(text, x, y) {
        this.context.fillText(text, x, y);
    }

    _drawBox(x, y, w, h) {
        this.context.strokeRect(x, y, w, h);
    }

    _drawCircle(x, y, r) {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI);
        this.context.fill();
    }

    _drawTriangle(x, y, w, h, filled = false) {
        let midX = x + (w / 2);
        this.context.beginPath();
        this.context.moveTo(midX, y);
        this.context.lineTo(x, y + h);
        this.context.lineTo(x + w, y + h);
        this.context.lineTo(midX, y);

        if (filled) {
            this.context.fill();
        }
        else {
            this.context.stroke();
        }
    }

    _drawIngredientRow(ingredients, x, y, color) {
        this.context.strokeStyle = color;

        for (let ingredient of ingredients) {
            let isSelected = (ingredient.name === this.selectedIngredient);

            this.context.fillStyle = color;
            this._drawTriangle(x, y, INGREDIENT_WIDTH, INGREDIENT_HEIGHT, isSelected);

            this.context.fillStyle = 'black';
            this._drawText(ingredient.name, x - (INGREDIENT_WIDTH/2), y + INGREDIENT_HEIGHT + INGREDIENT_NAME_BUFFER);
            
            x += INGREDIENT_WIDTH + INGREDIENT_HORIZONTAL_SEPARATION;
        }
    }

    _isPointInRect(x, y, w, h, pointX, pointY) {
        if (pointX >= x && pointX <= (x + w) &&
            pointY >= y && pointY <= (y + h)) {
                return true;
        }
        
        return false;
    }
};

module.exports = Draw;