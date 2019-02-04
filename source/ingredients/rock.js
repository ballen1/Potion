'use strict';

class Rock {
    constructor(_interval) {
        this.type = 'emitter';
        this.interval = _interval;
        this.signal = null;
    }

    brew() {
        if (this.signal) {
            setInterval(this.signal, this.interval);
        }
    }
};

module.exports = Rock;