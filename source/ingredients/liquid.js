'use strict'

class Liquid {
    constructor(_def) {
        this.type = 'modifier';
        this.target = _def.target;
    }
};

module.exports = Liquid;