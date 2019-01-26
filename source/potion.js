'use strict';

class Potion {
    constructor() {
        console.log("In Potion Constructor");

        navigator.requestMIDIAccess()
            .then(function(access) {
                const outputs = access.inputs.values();
                
                if (outputs.length > 0) {
                    setTimeout(() => { outputs[0].send([0x90, 0x45, 0x6f])}
                    , 2000);
                }
            });
    };
};

module.exports = Potion;