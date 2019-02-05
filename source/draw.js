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

const INGREDIENT_WIDTH = 40;
const INGREDIENT_HEIGHT = 40;

class Draw {
    constructor(_canvas, _midi, _cauldrons, _ingredients) {
        this.canvas = _canvas;
        this.context = this.canvas.getContext('2d');
        this.midi = _midi;
        this.cauldrons = _cauldrons;
        this.ingredients = _ingredients;

        this.context.font = '14px monospace';
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

        this.context.fillStyle = "green";

        for (let cauldron of this.cauldrons) {
            this._drawCircle(cauldron.x, cauldron.y,
                cauldron.width, cauldron.height);
        }

        this.context.strokeStyle = "red";

        let xPos = INGREDIENTS_PANEL_X + 20;
        let yPos = INGREDIENTS_PANEL_Y + 20;

        for (let emitter of this.ingredients.emitters) {
            this._drawTriangle(xPos, yPos, INGREDIENT_WIDTH, INGREDIENT_HEIGHT);
            xPos += INGREDIENT_WIDTH + 20;
        }

        this.context.strokeStyle = prevStrokeStyle;
        this.context.fillStyle = prevFillStyle;
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

    _drawTriangle(x, y, w, h) {
        let midX = x + (w / 2);
        this.context.beginPath();
        this.context.moveTo(midX, y);
        this.context.lineTo(x, y + h);
        this.context.lineTo(x + w, y + h);
        this.context.lineTo(midX, y);
        this.context.stroke();
    }
};

module.exports = Draw;