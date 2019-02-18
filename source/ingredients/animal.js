'use strict';

class Animal {
    constructor(_length) {
        this.type = 'length';
        this.length = _length;
    }

    get duration() {
        return this.length;
    }
};

module.exports = Animal;