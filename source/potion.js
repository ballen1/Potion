'use strict';

class Potion {
    constructor() {
        console.log("In Potion Constructor");

        navigator.requestMIDIAccess()
            .then(function(access) {
                const outputs = access.outputs.values();
                let first_output = outputs.next().value;
                console.log('Output ', first_output)
                setInterval(() => { 
                    let note = Math.random() * 127
                    console.log(note)
                    first_output.send(new Uint8Array([0x90, note, 0x45]))
                    setTimeout(() => {first_output.send(new Uint8Array([0x90, note, 0x00]))}, 1000);
                }
                , 500);
            });
    };
};

module.exports = Potion;