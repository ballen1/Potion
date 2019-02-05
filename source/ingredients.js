'use strict';

const Mushroom = require('./ingredients/mushroom');
const Rock = require('./ingredients/rock');

module.exports = {
    emitters : [
        { name: 'Basalt', length: 1000 },
        { name: 'Obsidian', length: 500 },
        { name: 'Gritstone', length: 250 }
    ],

    effects : [
        { name: 'Toadstool', note: 60 },
        { name: 'Morels', note: 62 },
        { name: 'Oyster', note: 64 }
    ],

    Mushroom : function(mushroom, midi) {
        return new Mushroom(midi, mushroom.note);
    },

    Rock : function(rock) {
        return new Rock(rock.length);
    }
};