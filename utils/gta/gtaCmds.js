const { randomNumber } = require('../randomNumber');
const gtaGames = require('./gtaGames.json');
const gtaRadios = require('./gtaRadios.json');

function randomRadio(game) {
    let radios = gtaRadios[game];
    returnStation = radios[randomNumber(0,radios.length)];
    return returnStation;
}

function isGTAGame(title) { 
    let found = false;
    if(gtaGames.threedUniverseGames.includes(title) || gtaGames.hdUniverseGames.includes(title)) {
        found = true;
    }
    return found;
}

module.exports.randomRadio = randomRadio;
module.exports.isGTAGame = isGTAGame; 