const player = require('play-sound')(opts = {player: 'mplayer.exe'});
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const soundsDir = 'c:\\Users\\aaron\\Dropbox\\Projects\\code\\twitch-node\\sounds'; // this is hacky and you should change it. make the script find it's own directory. 
const staticSounds = ['goteem.mp3', 'mgsAlert.mp3'];
const botSettings = require('../botSettings.json');

// let botSettings = 
// { 
//     channel_id: '9502699', 
//     auth_token: '98od3y6sx8lhzor3wxti5145em5xp4'
// };

let sounds = [];
fs.readdir(soundsDir, (error, files) => 
{
    if(error)
    {
        console.log(error);
    }
    console.log('Loading sounds...');
    files.forEach(file => {
        if(staticSounds.includes(file))
        {
            console.log(`Found static sound ${file}, skipping.`);
        }
        else
        {
            if(file.includes('.mp3'))
            {
                sounds.push(file);
                console.log(`Loaded sound ${file}.`);
            }
        }
    });
    console.log(`Loaded ${sounds.length} sounds.`);
});

let pubsubSocket = new WebSocket('wss://pubsub-edge.twitch.tv');

function playSound(sound)
{
    try
    {
        player.play(sound); // if this dies check that mplayer.exe is in %appdata%\npm 

        // you're going to want to make an instance and kill it after 10 seconds or so
        /*
        var audio = player.play('foo.mp3', function(err){
            if (err && !err.killed) throw err
          })
          audio.kill()
        */
    }
    catch(error)
    {
        console.log(`Error playing sound: ${error}`);
    }
}


function getChannelID(channel)
{
    // this turned into a 2 hour adventure 
}

function randomSound()
{
    
    playSound(randomSound[randomIndex]);
}

function proecssReward(reward)
{
    // have this read rewards from a DB one day
    // console.log(JSON.stringify(reward));
    console.log('Reward ' + reward.data.redemption.reward.title + ' was redeemed by ' + reward.data.redemption.user.display_name + ' for ' + reward.data.redemption.reward.cost + ' points');
    // redemptionData = reward.data.redemption;
    switch(reward.data.redemption.reward.title)
    {
        case 'Goteem':
        {
            playSound(`${soundsDir}/goteem.mp3`);
            break;
        }
        case 'MGS Alert':
        {
            playSound(`${soundsDir}/mgsAlert.mp3`);
            break;
        }
        case 'Random sound':
        {
            let randomIndex = Math.floor(Math.random() * Math.floor(sounds.length));
            console.log(`Playing random sound ${sounds[randomIndex]}`);
            playSound(soundsDir + '/' + sounds[randomIndex]);
            break;
        }
        default:
        {
            break;
        }
    }
    
}

function sendPings()
{
    pubsubSocket.send(JSON.stringify({type:"PING"}));
    setTimeout(sendPings,120000); // 2 minutes
}

function pubsubMessageHandler(msg)
{
    if(msg.type == 'MESSAGE')
    {
        pubsubMessage = JSON.parse(msg.data.message);
        if(pubsubMessage.type == 'reward-redeemed')
        {
            proecssReward(pubsubMessage);
        }
    }
}

pubsubSocket.onopen = function(e)
{
    let connectMsg = 
    {
        type: "LISTEN",
        nonce: "44h1k13746815ab1r2",
        data: 
        {
          topics: ["channel-points-channel-v1." + botSettings.channelID],
          auth_token: botSettings.password
        //   auth_token: "98od3y6sx8lhzor3wxti5145em5xp4"
        
        }
    };
    pubsubSocket.send(JSON.stringify(connectMsg));
    console.log(`Pubsub connected. Listed topics: ${connectMsg.data.topics}`);
    sendPings();
};

pubsubSocket.onmessage = function(event) 
{
    // console.log(event.data);
    pubsubResonse = JSON.parse(event.data);
    pubsubMessageHandler(pubsubResonse);
};

