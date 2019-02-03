'use strict';

class Input {
    constructor(_canvas) {
        this.canvas = _canvas;

        this.clickHandler = null;
        this.keydownHandler = null;

        this.clickBound = event => this.click(event);
        this.keydownBound = event => this.keydown(event);

        this.canvas.addEventListener("click", this.clickBound);
        window.addEventListener("keydown", this.keydownBound);
    }

    click(event) {
        this.callEventHandler(this.clickHandler);
    }

    keydown(event) {
        this.callEventHandler(this.keydownHandler, event.key);
        event.preventDefault();
    }

    callEventHandler(handler, ...args) {
        if (handler) {
            handler(...args);
        }
        else {
            console.error("Event handler has not been configured!");
        }
    };
};

module.exports = Input;