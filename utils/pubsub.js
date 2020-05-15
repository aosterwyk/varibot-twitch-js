const player = require('play-sound')(opts = {player: 'mplayer.exe'});
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const botSettings = require('../botSettings.json');
const soundsDir = botSettings.soundsDir;
const chalk = require('chalk');
const pointSounds = require('../channelPointsSounds.json');
const { getChannelID } = require('./api');

let sounds = [];
let staticSounds = [botSettings.beatGameSound];
for(sound in pointSounds) { 
    staticSounds.push(pointSounds[sound]);
}

fs.readdir(soundsDir, (error, files) => {
    if(error) {
        console.log(chalk.red(error));
    }
    console.log('Loading sounds...');
    if(files.length > 0) {
        files.forEach(file => {
            if(staticSounds.includes(file) || pointSounds[file]) {
                console.log(`Found static sound ${file}, skipping.`);
            }
            else {
                if(file.includes('.mp3')){
                    sounds.push(file);
                    // console.log(`Loaded sound ${file}.`);
                }
            }
        });
    }
    console.log(`Loaded ${sounds.length} sounds.`);
});

let pubsubSocket = new WebSocket('wss://pubsub-edge.twitch.tv');

function playSound(sound) {
    try {
        player.play(sound); // if this dies check that mplayer.exe is in %appdata%\npm 
    }
    catch(error) {
        console.log(chalk.red(`Error playing sound: ${error}`));
    }
}

function proecssReward(reward) {
    console.log(chalk.greenBright('Reward ' + reward.data.redemption.reward.title + ' was redeemed by ' + reward.data.redemption.user.display_name + ' for ' + reward.data.redemption.reward.cost + ' points'));
    if(reward.data.redemption.reward.title in pointSounds) { 
        playSound(`${soundsDir}/${pointSounds[reward.data.redemption.reward.title]}`);
        console.log(chalk.cyan(`Playing sound ${pointSounds[reward.data.redemption.reward.title]}`));
    }
    else if(reward.data.redemption.reward.title == 'Random sound') { 
        let randomIndex = Math.floor(Math.random() * Math.floor(sounds.length));
        console.log(chalk.cyan(`Playing random sound ${sounds[randomIndex]}`));
        playSound(`${soundsDir}/${sounds[randomIndex]}`);
    }
}

function sendPings() {
    pubsubSocket.send(JSON.stringify({type:"PING"}));
    setTimeout(sendPings,120000); // 2 minutes
}

function pubsubMessageHandler(msg) {
    if(msg.type == 'MESSAGE') {
        pubsubMessage = JSON.parse(msg.data.message);
        if(pubsubMessage.type == 'reward-redeemed') {
            proecssReward(pubsubMessage);
        }
    }
}

pubsubSocket.onopen = async function(e) {
    let channelId = await getChannelID(botSettings.channel);
    let connectMsg =  {
        type: "LISTEN",
        nonce: "44h1k13746815ab1r2",
        data:  {
          topics: ["channel-points-channel-v1." + channelId],
          auth_token: botSettings.password
        }
    };
    pubsubSocket.send(JSON.stringify(connectMsg));
    console.log(chalk.green(`Pubsub connected. Listed topics: ${connectMsg.data.topics}`));
    sendPings();
};

pubsubSocket.onmessage = function(event)  {
    pubsubResonse = JSON.parse(event.data);
    pubsubMessageHandler(pubsubResonse);
};

