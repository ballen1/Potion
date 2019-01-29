'use strict';

class Input {
    constructor(_canvas) {
        this.canvas = _canvas;

        this.clickBound = event => this.click(event);
        this.canvas.addEventListener("click", this.clickBound);
    }

    click(event) {
        this.callEventHandler(this.clickHandler);
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