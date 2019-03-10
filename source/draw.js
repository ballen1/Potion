'use strict';

const UI = require('./ui_layout');
const { isPointInCircle } = require('./collision');

class Draw {
    constructor(_canvas, _midi, _ingredients, _magician) {
        this.canvas = _canvas;
        this.context = this.canvas.getContext('2d');
        this.midi = _midi;
        this.ingredients = _ingredients;

        this.magician = _magician;

        this.context.font = 'bold 14px monospace';

        this.selectedIngredient = this.ingredients.all[0].name;
        this.selectedCauldron = null;

        this.editValueMode = false;
        this.editValue = '';
    }

    drawCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._drawBox(UI.CONTROL_PANEL_X, UI.CONTROL_PANEL_Y,
            UI.CONTROL_PANEL_WIDTH, UI.CONTROL_PANEL_HEIGHT);
        this._drawText(this.midi.output.name, UI.MIDI_OUTPUT_X, UI.MIDI_OUTPUT_Y);
        this._drawBox(UI.MAIN_PANEL_X, UI.MAIN_PANEL_Y,
            UI.MAIN_PANEL_WIDTH, UI.MAIN_PANEL_HEIGHT);
        this._drawBox(UI.INGREDIENTS_PANEL_X, UI.INGREDIENTS_PANEL_Y,
            UI.INGREDIENTS_WIDTH, UI.INGREDIENTS_HEIGHT);
        this._drawBox(UI.VISUAL_PANEL_X, UI.VISUAL_PANEL_Y,
            UI.VISUAL_PANEL_WIDTH, UI.VISUAL_PANEL_HEIGHT);
        this._drawText("BPM: " + this.magician.bpm,
            UI.VISUAL_BPM_X, UI.VISUAL_BPM_Y);
        this._drawBox(UI.BPM_WIDGET_X, UI.BPM_WIDGET_Y, UI.BPM_WIDGET_WIDTH, UI.BPM_WIDGET_HEIGHT);

        this._drawBox(UI.BPM_WIDGET_X + this.magician.currentBeat * (UI.BPM_WIDGET_WIDTH / this.magician.beatsPerBar),
                        UI.BPM_WIDGET_Y,
                        UI.BPM_WIDGET_WIDTH / this.magician.beatsPerBar,
                        UI.BPM_WIDGET_HEIGHT,
                        true);

        this._drawText("Octave: " + this.magician.octave, UI.OCTAVE_LABEL_X, UI.OCTAVE_LABEL_Y);
        this._drawBox(UI.OCTAVE_WIDGET_X, UI.OCTAVE_WIDGET_Y, UI.OCTAVE_WIDGET_WIDTH, UI.OCTAVE_WIDGET_HEIGHT);
        this._drawBox(UI.OCTAVE_WIDGET_X + this.magician.octave * (UI.OCTAVE_WIDGET_WIDTH / UI.OCTAVE_WIDGET_SEGMENTS),
                      UI.OCTAVE_WIDGET_Y,
                      UI.OCTAVE_WIDGET_WIDTH / UI.OCTAVE_WIDGET_SEGMENTS,
                      UI.OCTAVE_WIDGET_HEIGHT,
                      true);

        this._drawText("Channel: " + this.magician.channel, UI.CHANNEL_LABEL_X, UI.CHANNEL_LABEL_Y);
        this._drawBox(UI.CHANNEL_WIDGET_X, UI.CHANNEL_WIDGET_Y, UI.CHANNEL_WIDGET_WIDTH, UI.CHANNEL_WIDGET_HEIGHT);
        this._drawBox(UI.CHANNEL_WIDGET_X + this.magician.channel * (UI.CHANNEL_WIDGET_WIDTH / UI.CHANNEL_WIDGET_SEGMENTS),
                      UI.CHANNEL_WIDGET_Y,
                      UI.CHANNEL_WIDGET_WIDTH / UI.CHANNEL_WIDGET_SEGMENTS,
                      UI.CHANNEL_WIDGET_HEIGHT,
                      true);
        
        this._drawLine(
            UI.WIDGET_DIVIDER_1_X, UI.WIDGET_DIVIDER_1_Y,
            UI.WIDGET_DIVIDER_1_X + UI.WIDGET_DIVIDER_1_WIDTH,
            UI.WIDGET_DIVIDER_1_Y
        );

        let prevFontStyle = this.context.font;

        if (this.editValueMode) {
            this.context.font = 'bold 72px monospace';
            this.context.fillStyle = 'red';

            let valueText = this.editValue.length < 3 ? (this.editValue + '_') : this.editValue;
            this._drawText(valueText, UI.VALUE_WIDGET_X, UI.VALUE_WIDGET_Y);
        }
        else {
            this.context.font = 'bold 72px monospace';
            this._drawText(this.magician.value, UI.VALUE_WIDGET_X, UI.VALUE_WIDGET_Y);
        }

        this.context.font = prevFontStyle;
        this.context.fillStyle = 'black';

        this._drawLine(
            UI.WIDGET_DIVIDER_2_X, UI.WIDGET_DIVIDER_2_Y,
            UI.WIDGET_DIVIDER_2_X + UI.WIDGET_DIVIDER_2_WIDTH,
            UI.WIDGET_DIVIDER_2_Y
        )

        const prevStrokeStyle = this.context.strokeStyle;
        const prevFillStyle = this.context.fillStyle;

        this.context.fillStyle = 'green';

        for (let cauldron of this.magician.cauldrons) {
            let coords = this.worldToScreenCoords(cauldron.x, cauldron.y);

            if (cauldron === this.selectedCauldron) {
                this.context.fillStyle = 'black';
                this._drawCircle(coords.x, coords.y, cauldron.radius + UI.CAULDRON_HIGHLIGHT_BORDER_WIDTH);
            }

            if (cauldron.isExpanding()) {
                this.context.fillStyle = 'purple';
                this._drawCircle(coords.x, coords.y, cauldron.expansionRadius);
            }

            if (cauldron.isActive()) {
                this.context.fillStyle = 'orange';
            }
            else {
                if (cauldron.ingredientSet == 'None' || cauldron.ingredientSet == 'EmitterSet')
                {
                    this.context.fillStyle = 'green';
                }
                else if (cauldron.ingredientSet == 'FilterSet')
                {
                    this.context.fillStyle = 'SkyBlue';
                }
            }

            this._drawCircle(coords.x, coords.y, cauldron.radius);
        }

        let xPos = UI.INGREDIENTS_PANEL_X + 40;
        let yPos = UI.INGREDIENTS_PANEL_Y + 15;

        this._drawIngredientRow(this.ingredients.ofType('emitter'), xPos, yPos, 'red');

        xPos = UI.INGREDIENTS_PANEL_X + 40;
        yPos += UI.INGREDIENT_HEIGHT + UI.INGREDIENT_VERTICAL_SEPARATION;

        this._drawIngredientRow(this.ingredients.ofType('effect'), xPos, yPos, 'blue');

        xPos = UI.INGREDIENTS_PANEL_X + 40;
        yPos += UI.INGREDIENT_HEIGHT + UI.INGREDIENT_VERTICAL_SEPARATION;

        this._drawIngredientRow(this.ingredients.ofType('length'), xPos, yPos, 'purple');

        xPos = UI.INGREDIENTS_PANEL_X + 40;
        yPos += UI.INGREDIENT_HEIGHT + UI.INGREDIENT_VERTICAL_SEPARATION;

        this._drawIngredientRow(this.ingredients.ofType('value'), xPos, yPos, 'black');

        xPos = UI.INGREDIENTS_PANEL_X + 40;
        yPos += UI.INGREDIENT_HEIGHT + UI.INGREDIENT_VERTICAL_SEPARATION;

        this._drawIngredientRow(this.ingredients.ofType('filter'), xPos, yPos, 'yellow');

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
        else if (!isNaN(key)) {
            if (this.editValueMode) {
                if (this.editValue.length < 3) {
                    this.editValue += key;
                }
            }
            else {
                this.editValueMode = true;
                this.editValue = key;
            }
        }
        else if (key == 'Escape') {
            this.editValueMode = false;
            this.editValue = '';
        }
        else if (key == 'Tab') {
            if (this.editValueMode) {
                this.magician.value = parseInt(this.editValue);
                this.editValueMode = false;
                this.editValue = '';
            }
        }
    }

    handleClick(x, y) {
        if (this._isPointInRect(UI.MAIN_PANEL_X, UI.MAIN_PANEL_Y,
            UI.MAIN_PANEL_WIDTH, UI.MAIN_PANEL_HEIGHT,
            x, y)) {
            let coords = this.screenToWorldCoords(x, y);
            let clear = true;
            for (let cauldron of this.magician.cauldrons) {
                if (isPointInCircle(coords.x, coords.y, cauldron.boundingCircle)) {
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
            x: x - UI.MAIN_PANEL_X,
            y: y - UI.MAIN_PANEL_Y
        }
    }

    worldToScreenCoords(x, y) {
        return {
            x: x + UI.MAIN_PANEL_X,
            y: y + UI.MAIN_PANEL_Y
        }
    }

    isInWorldRegion(x, y) {
        return this._isPointInRect(
                UI.MAIN_PANEL_X, UI.MAIN_PANEL_Y,
                UI.MAIN_PANEL_WIDTH, UI.MAIN_PANEL_HEIGHT,
                x, y
            );
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

    _drawLine(x1, y1, x2, y2) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
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
        this.context.font = 'bold 12px monospace';

        this.context.strokeStyle = color;

        for (let ingredient of ingredients) {
            let isSelected = (ingredient.name === this.selectedIngredient);

            this.context.fillStyle = color;
            this._drawTriangle(x, y, UI.INGREDIENT_WIDTH, UI.INGREDIENT_HEIGHT, isSelected);

            this.context.fillStyle = 'black';
            this._drawText(ingredient.name, x - (3*ingredient.name.length), y + UI.INGREDIENT_HEIGHT + UI.INGREDIENT_NAME_BUFFER);
            
            x += UI.INGREDIENT_WIDTH + UI.INGREDIENT_HORIZONTAL_SEPARATION;
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