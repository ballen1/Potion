'use strict';

class Rock {
    constructor(_interval) {
        this.type = 'emitter';
        this.interval = _interval;
        this.signal = null;

        this.elapsed = 0;
    }

    brew() {
        if (this.signal) {
            this.elapsed += 1;
            if (this.elapsed === this.interval) {
                this.signal();
                this.elapsed = 0;
            }   
        }
    }
};

module.exports = Rock;