'use strict';

const Mushroom = require('./ingredients/mushroom');
const Rock = require('./ingredients/rock');

module.exports = {
    all : [
        { name: 'Basalt', type: 'emitter', length: 4 },
        { name: 'Obsidian', type: 'emitter', length: 2 },
        { name: 'Gritstone', type: 'emitter', length: 1 },
    
        { name: 'Toadstool', type: 'effect', note: 60 },
        { name: 'Morels', type: 'effect', note: 62 },
        { name: 'Oyster', type: 'effect', note: 64 },
        { name: 'Enoki', type: 'effect', note: 65 },
        { name: 'Chanterelle', type: 'effect', note: 67 },
        { name: 'Porcino', type: 'effect', note: 69 },
        { name: 'Portabello', type: 'effect', note: 71 }
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

    Mushroom : function(mushroom, midi) {
        return new Mushroom(midi, mushroom.note);
    },

    Rock : function(rock) {
        return new Rock(rock.length);
    }
};