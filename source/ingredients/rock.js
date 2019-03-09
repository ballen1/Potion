'use strict';

class Rock {
    constructor(_def) {
        this.type = 'emitter';
        this.position = _def.position;
        this.signal = null;

        this.elapsed = 0;

        this.expanding = false;
        this.maxExpansion = 20;
        this.currentExpansion = 0;
        this.expandingState = 'None';
        this.expansionAmount = 1;
        this.expansionInterval = 5;
    }

    brew(beat) {
        if (this.signal) {
            if (beat === this.position) {
                this._beginExpansion();
                this.signal();
            }
        }
    }

    applyValue(value) {
        this.maxExpansion = value;
    }

    _beginExpansion() {
        this.expanding = true;
        this.expandingState = 'Out';
        this._expand();
    }

    _expand() {
        let id = setInterval(() => {
            if (this.expandingState == 'Out') {
                this.currentExpansion = Math.min(this.maxExpansion, this.currentExpansion + this.expansionAmount);
                
                if (this.currentExpansion >= this.maxExpansion) {
                    this.expandingState = 'In';
                }
            }
            else if (this.expandingState == 'In') {
                this.currentExpansion = Math.max(0, this.currentExpansion - this.expansionAmount);

                if (this.currentExpansion <= 0) {
                    this.expanding = false;
                    this.expandingState = 'None';
                    clearInterval(id);
                }
            }
        }, this.expansionInterval);
    }
};

module.exports = Rock;