'use strict';

const Animal = require('./ingredients/animal');
const Mushroom = require('./ingredients/mushroom');
const Rock = require('./ingredients/rock');
const Liquid = require('./ingredients/liquid');
const Crystal = require('./ingredients/crystal');

module.exports = {
    all : [
        { name: 'Basalt', type: 'emitter', position: 1 },
        { name: 'Pumice', type: 'emitter', position: 2 },
        { name: 'Obsidian', type: 'emitter', position: 3 },
        { name: 'Gritstone', type: 'emitter', position: 4 },
    
        { name: 'Toadstool', type: 'effect', note: 'C' },
        { name: 'Garlic', type: 'effect', note: 'C#' },
        { name: 'Morels', type: 'effect', note: 'D' },
        { name: 'Ginger', type: 'effect', note: 'D#' },
        { name: 'Oyster', type: 'effect', note: 'E' },
        { name: 'Enoki', type: 'effect', note: 'F' },
        { name: 'Beet', type: 'effect', note: 'F#' },
        { name: 'Chanterelle', type: 'effect', note: 'G' },
        { name: 'Turnip', type: 'effect', note: 'G#' },
        { name: 'Porcino', type: 'effect', note: 'A' },
        { name: 'Rutabaga', type: 'effect', note: 'A#' },
        { name: 'Portabello', type: 'effect', note: 'B' },

        { name: 'Spider Legs', type: 'length', length: 1},
        { name: 'Talons', type: 'length', length: 2},
        { name: 'Hairs', type: 'length', length: 4},

        { name: 'Quartz', type: 'value' }
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

    Mushroom : function(midi, mushroom, channel, octave, beatMs) {
        return new Mushroom(midi, mushroom, channel, octave, beatMs);
    },

    Rock : function(rock) {
        return new Rock(rock);
    },

    Animal : function(animal) {
        return new Animal(animal);
    },

    Liquid : function(liquid) {
        return new Liquid(liquid);
    },

    Crystal : function(crystal) {
        return new Crystal(crystal);
    }
};