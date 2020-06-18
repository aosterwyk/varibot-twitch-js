const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);

async function loadSounds(soundsDir, exclude) { 
    try {
        let resultSound = [];        
        let sounds = await readdir(soundsDir);
        // sounds.forEach(sounds[x] => {
        for(let x = 0; x < sounds.length; x++) {
            if(exclude.includes(sounds[x])) {
                continue;
            }
            if(sounds[x].includes('.mp3') || sounds[x].includes('.m4a')) {
                resultSound.push(sounds[x]);
            }
        }
        return resultSound;
    }
    catch (err) {
        return err;
    }
}

module.exports.loadSounds = loadSounds;
