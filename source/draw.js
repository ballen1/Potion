'use strict';

const CONTROL_PANEL_X = 10;
const CONTROL_PANEL_Y = 10;
const CONTROL_PANEL_WIDTH = 980;
const CONTROL_PANEL_HEIGHT = 30;

const VISUAL_PANEL_X = CONTROL_PANEL_X + CONTROL_PANEL_WIDTH + 10;
const VISUAL_PANEL_Y = CONTROL_PANEL_Y;
const VISUAL_PANEL_WIDTH = 190
const VISUAL_PANEL_HEIGHT = 680

const VISUAL_BPM_X = VISUAL_PANEL_X + 10;
const VISUAL_BPM_Y = VISUAL_PANEL_Y + 20;

const BPM_WIDGET_X = VISUAL_PANEL_X + 10;
const BPM_WIDGET_Y = VISUAL_BPM_Y + 10;
const BPM_WIDGET_WIDTH = VISUAL_PANEL_WIDTH - 20;
const BPM_WIDGET_HEIGHT = 30;

const OCTAVE_LABEL_X = VISUAL_PANEL_X + 10;
const OCTAVE_LABEL_Y = BPM_WIDGET_Y + BPM_WIDGET_HEIGHT + 20;

const OCTAVE_WIDGET_X = VISUAL_PANEL_X + 10;
const OCTAVE_WIDGET_Y = OCTAVE_LABEL_Y + 10;
const OCTAVE_WIDGET_WIDTH = VISUAL_PANEL_WIDTH - 20;
const OCTAVE_WIDGET_HEIGHT = 30;
const OCTAVE_WIDGET_SEGMENTS = 10;

const CHANNEL_LABEL_X = VISUAL_PANEL_X + 10;
const CHANNEL_LABEL_Y = OCTAVE_WIDGET_Y + OCTAVE_WIDGET_HEIGHT + 20;

const CHANNEL_WIDGET_X = VISUAL_PANEL_X + 10;
const CHANNEL_WIDGET_Y = CHANNEL_LABEL_Y + 10;
const CHANNEL_WIDGET_WIDTH = VISUAL_PANEL_WIDTH - 20;
const CHANNEL_WIDGET_HEIGHT = 30;
const CHANNEL_WIDGET_SEGMENTS = 16;

const MIDI_OUTPUT_X = CONTROL_PANEL_X + 10;
const MIDI_OUTPUT_Y = CONTROL_PANEL_Y + 20;

const MAIN_PANEL_X = CONTROL_PANEL_X;
const MAIN_PANEL_Y = CONTROL_PANEL_Y + CONTROL_PANEL_HEIGHT + 10;
const MAIN_PANEL_WIDTH = CONTROL_PANEL_WIDTH;
const MAIN_PANEL_HEIGHT = 400;

const INGREDIENTS_PANEL_X = MAIN_PANEL_X;
const INGREDIENTS_PANEL_Y = MAIN_PANEL_Y + MAIN_PANEL_HEIGHT + 10;
const INGREDIENTS_WIDTH = MAIN_PANEL_WIDTH;
const INGREDIENTS_HEIGHT = 230;

const INGREDIENT_WIDTH = 15;
const INGREDIENT_HEIGHT = 20;
const INGREDIENT_NAME_BUFFER = 20;
const INGREDIENT_FONT_SIZE = 5;
const INGREDIENT_HORIZONTAL_SEPARATION = INGREDIENT_WIDTH * 4;
const INGREDIENT_VERTICAL_SEPARATION = INGREDIENT_HEIGHT + 25;

const CAULDRON_HIGHLIGHT_BORDER_WIDTH = 3;

class Draw {
    constructor(_canvas, _midi, _ingredients, _magician) {
        this.canvas = _canvas;
        this.context = this.canvas.getContext('2d');
        this.midi = _midi;
        this.ingredients = _ingredients;

        this.magician = _magician;

        this.context.font = '14px monospace';

        this.selectedIngredient = this.ingredients.all[0].name;
        this.selectedCauldron = null;
    }

    drawCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._drawBox(CONTROL_PANEL_X, CONTROL_PANEL_Y,
            CONTROL_PANEL_WIDTH, CONTROL_PANEL_HEIGHT);
        this._drawText(this.midi.output.name, MIDI_OUTPUT_X, MIDI_OUTPUT_Y);
        this._drawBox(MAIN_PANEL_X, MAIN_PANEL_Y,
            MAIN_PANEL_WIDTH, MAIN_PANEL_HEIGHT);
        this._drawBox(INGREDIENTS_PANEL_X, INGREDIENTS_PANEL_Y,
            INGREDIENTS_WIDTH, INGREDIENTS_HEIGHT);
        this._drawBox(VISUAL_PANEL_X, VISUAL_PANEL_Y,
            VISUAL_PANEL_WIDTH, VISUAL_PANEL_HEIGHT);
        this._drawText("BPM: " + this.magician.bpm,
            VISUAL_BPM_X, VISUAL_BPM_Y);
        this._drawBox(BPM_WIDGET_X, BPM_WIDGET_Y, BPM_WIDGET_WIDTH, BPM_WIDGET_HEIGHT);

        this._drawBox(BPM_WIDGET_X + this.magician.currentBeat * (BPM_WIDGET_WIDTH / this.magician.beatsPerBar),
                        BPM_WIDGET_Y,
                        BPM_WIDGET_WIDTH / this.magician.beatsPerBar,
                        BPM_WIDGET_HEIGHT,
                        true);

        this._drawText("Octave: " + this.magician.octave, OCTAVE_LABEL_X, OCTAVE_LABEL_Y);
        this._drawBox(OCTAVE_WIDGET_X, OCTAVE_WIDGET_Y, OCTAVE_WIDGET_WIDTH, OCTAVE_WIDGET_HEIGHT);
        this._drawBox(OCTAVE_WIDGET_X + this.magician.octave * (OCTAVE_WIDGET_WIDTH / OCTAVE_WIDGET_SEGMENTS),
                      OCTAVE_WIDGET_Y,
                      OCTAVE_WIDGET_WIDTH / OCTAVE_WIDGET_SEGMENTS,
                      OCTAVE_WIDGET_HEIGHT,
                      true);

        this._drawText("Channel: " + this.magician.channel, CHANNEL_LABEL_X, CHANNEL_LABEL_Y);
        this._drawBox(CHANNEL_WIDGET_X, CHANNEL_WIDGET_Y, CHANNEL_WIDGET_WIDTH, CHANNEL_WIDGET_HEIGHT);
        this._drawBox(CHANNEL_WIDGET_X + this.magician.channel * (CHANNEL_WIDGET_WIDTH / CHANNEL_WIDGET_SEGMENTS),
                      CHANNEL_WIDGET_Y,
                      CHANNEL_WIDGET_WIDTH / CHANNEL_WIDGET_SEGMENTS,
                      CHANNEL_WIDGET_HEIGHT,
                      true);
        
        const prevStrokeStyle = this.context.strokeStyle;
        const prevFillStyle = this.context.fillStyle;

        this.context.fillStyle = 'green';

        for (let cauldron of this.magician.cauldrons) {
            let coords = this.worldToScreenCoords(cauldron.x, cauldron.y);

            if (cauldron === this.selectedCauldron) {
                this.context.fillStyle = 'black';
                this._drawCircle(coords.x, coords.y, cauldron.radius + CAULDRON_HIGHLIGHT_BORDER_WIDTH);
            }

            if (cauldron.isActive()) {
                this.context.fillStyle = 'orange';
            }
            else {
                this.context.fillStyle = 'green';
            }

            this._drawCircle(coords.x, coords.y, cauldron.radius);
        }

        let xPos = INGREDIENTS_PANEL_X + 40;
        let yPos = INGREDIENTS_PANEL_Y + 15;

        this._drawIngredientRow(this.ingredients.ofType('emitter'), xPos, yPos, 'red');

        xPos = INGREDIENTS_PANEL_X + 40;
        yPos += INGREDIENT_HEIGHT + INGREDIENT_VERTICAL_SEPARATION;

        this._drawIngredientRow(this.ingredients.ofType('effect'), xPos, yPos, 'blue');

        xPos = INGREDIENTS_PANEL_X + 40;
        yPos += INGREDIENT_HEIGHT + INGREDIENT_VERTICAL_SEPARATION;

        this._drawIngredientRow(this.ingredients.ofType('length'), xPos, yPos, 'purple');

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
            let clear = true;
            for (let cauldron of this.magician.cauldrons) {
                let bounds = cauldron.boundingBox;
                if (this._isPointInRect(bounds.x, bounds.y,
                    bounds.w, bounds.h, coords.x, coords.y)) {
                    this.selectedCauldron = cauldron;
                    clear = false;
                    break;
                }
            }

            if (clear) {
                this.selectedCauldron = null;
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

    _drawBox(x, y, w, h, filled = false) {
        if (filled) {
            this.context.fillRect(x, y, w, h);
        }
        else {
            this.context.strokeRect(x, y, w, h);
        }
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
        let prevFontStyle = this.context.font;
        this.context.font = '12px monospace';

        this.context.strokeStyle = color;

        for (let ingredient of ingredients) {
            let isSelected = (ingredient.name === this.selectedIngredient);

            this.context.fillStyle = color;
            this._drawTriangle(x, y, INGREDIENT_WIDTH, INGREDIENT_HEIGHT, isSelected);

            this.context.fillStyle = 'black';
            this._drawText(ingredient.name, x - (3*ingredient.name.length), y + INGREDIENT_HEIGHT + INGREDIENT_NAME_BUFFER);
            
            x += INGREDIENT_WIDTH + INGREDIENT_HORIZONTAL_SEPARATION;
        }

        this.context.font = prevFontStyle;
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