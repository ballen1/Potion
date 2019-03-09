'use strict'

class Liquid {
    constructor(_def) {
        this.type = 'filter';
        this.target = _def.target;
    }
};

module.exports = Liquid;