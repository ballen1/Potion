'use strict';

class Animal {
    constructor(_def) {
        this.type = 'length';
        this.length = _def.length;
    }

    get duration() {
        return this.length;
    }
};

module.exports = Animal;