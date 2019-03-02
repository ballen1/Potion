'use strict'

class Crystal {
    constructor(_def) {
        this.type = 'value';
        this.value = _def.value;
    }
};

module.exports = Crystal;