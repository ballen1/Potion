'use strict';

const CONTROL_PANEL_X = 10;
const CONTROL_PANEL_Y = 10;
const CONTROL_PANEL_WIDTH = 780;
const CONTROL_PANEL_HEIGHT = 30;

const MIDI_OUTPUT_X = CONTROL_PANEL_X + 10;
const MIDI_OUTPUT_Y = CONTROL_PANEL_Y + 20;

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
        this._drawText(this.midi.output.name, MIDI_OUTPUT_X, MIDI_OUTPUT_Y);   
    }

    _drawText(text, x, y) {
        this.context.fillText(text, x, y);
    }

    _drawBox(x, y, w, h) {
        this.context.strokeRect(x, y, w, h);
    }
};

module.exports = Draw;