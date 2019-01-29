class Midi {
    constructor() {
        navigator.requestMIDIAccess()
        .then(function(access) {
            
        });
    }
};

module.exports = Midi;