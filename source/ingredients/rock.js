'use strict';

class Rock {
    constructor(_position) {
        this.type = 'emitter';
        this.position = _position;
        this.signal = null;

        this.elapsed = 0;
    }

    brew(beat) {
        if (this.signal) {
            if (beat === this.position) {
                this.signal();
            }
        }
    }
};

module.exports = Rock;