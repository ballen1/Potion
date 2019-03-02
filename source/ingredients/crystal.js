'use strict'

class Crystal {
    constructor(_def, _value) {
        this.name = _def.name;
        this.type = _def.type;
        this.value = _value;
    }
};

module.exports = Crystal;