const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);

async function loadSounds(soundsDir) { 
    let resultSound = [];
    try {
        let sounds = await readdir(soundsDir);
        sounds.forEach(file => {
            if(file.includes('.mp3') || file.includes('.m4a')) {
                resultSound.push(file);
            }
        });
        return resultSound;
    }
    catch (err) {
        return err;
    }
}

module.exports.loadSounds = loadSounds;
