'use strict';

const Mushroom = require('./ingredients/mushroom');
const Rock = require('./ingredients/rock');

module.exports = {
    all : [
        { name: 'Basalt', type: 'emitter', length: 1000 },
        { name: 'Obsidian', type: 'emitter', length: 500 },
        { name: 'Gritstone', type: 'emitter', length: 250 },
    
        { name: 'Toadstool', type: 'effect', note: 60 },
        { name: 'Morels', type: 'effect', note: 62 },
        { name: 'Oyster', type: 'effect', note: 64 }
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