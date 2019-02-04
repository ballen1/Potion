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

class Draw {
    constructor(_canvas, _midi, _cauldrons) {
        this.canvas = _canvas;
        this.context = this.canvas.getContext('2d');
        this.midi = _midi;
        this.cauldrons = _cauldrons;

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

        for (let cauldron of this.cauldrons) {
            this._drawBox(MAIN_PANEL_X + cauldron.x, MAIN_PANEL_Y + cauldron.y,
                cauldron.width, cauldron.height);
        }
    }

    _drawText(text, x, y) {
        this.context.fillText(text, x, y);
    }

    _drawBox(x, y, w, h) {
        this.context.strokeRect(x, y, w, h);
    }
};

module.exports = Draw;