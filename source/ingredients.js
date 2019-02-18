'use strict';

const Mushroom = require('./ingredients/mushroom');
const Rock = require('./ingredients/rock');

module.exports = {
    all : [
        { name: 'Basalt', type: 'emitter', position: 4 },
        { name: 'Pumice', type: 'emitter', position: 3 },
        { name: 'Obsidian', type: 'emitter', position: 2 },
        { name: 'Gritstone', type: 'emitter', position: 1 },
    
        { name: 'Toadstool', type: 'effect', note: 'C' },
        { name: 'Morels', type: 'effect', note: 'D' },
        { name: 'Oyster', type: 'effect', note: 'E' },
        { name: 'Enoki', type: 'effect', note: 'F' },
        { name: 'Chanterelle', type: 'effect', note: 'G' },
        { name: 'Porcino', type: 'effect', note: 'A' },
        { name: 'Portabello', type: 'effect', note: 'B' }
    ],

    ofType : function(type) {
        return module.exports.all.filter((ingredient) => {
            return ingredient.type === type;
        });
    },

    byName : function(name) {
        return module.exports.all.find((ingredient) => {
            return ingredient.name === name;
        });
    },

    Mushroom : function(midi, mushroom, channel, octave) {
        return new Mushroom(midi, mushroom.note, channel, octave);
    },

    Rock : function(rock) {
        return new Rock(rock.position);
    }
};