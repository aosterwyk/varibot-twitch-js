const tmi = require('tmi.js');
const pubsubBot = require('../pubsub/index');
const botSettings = require('../botSettings.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const twitchAPI = require('../api/index');

const options = {
    identity: {
        username: botSettings.username,
        password: botSettings.password
    },
    channels: [botSettings.channel]
};

threedUniverseGames = ["Grand Theft Auto: Vice City Stories", "Grand Theft Auto: Vice City", "Grand Theft Auto: San Andreas", "Grand Theft Auto: Liberty City Stories", "Grand Theft Auto III"];
threedUniverseTimeline = "Vice City Stories (1984) Vice City (1986) San Andreas (1992) Liberty City Stories (1998) Advance (2000) (Skipped) GTA III (2001)";
hdUniverseGames = ["Grand Theft Auto IV", "Grand Theft Auto: Episodes from Liberty City", "Grand Theft Auto: Chinatown Wars", "Grand Theft Auto V"];
hdUniverseTimeline = "GTA IV (2008) The Lost and Damned (2008) The Ballad of Gay Tony (2008) Chinatown Wars (2009) GTA Online (2013-present) (Skipped)  GTA V (2013)";
gtaRadios = {
"Grand Theft Auto III" : ["Chatterbox FM", "Double Clef FM", "Flashback 95.6", "Game FM", "Head Radio", "K-Jah", "Lips 106", "MSX FM", "Rise FM"], 
"Grand Theft Auto: Vice City" : ["Emotion 98.3", "Fever 105", "Flash FM", "KCHAT", "Radio Espantoso", "V-Rock", "VCPR", "Wave 103", "Wildstyle"], 
"Grand Theft Auto: San Andreas" : ["Bounce FM", "CSR 103.9", "K Rose", "K-DST", "K-Jah West", "Master Sounds 98.3", "Playback FM", "Radio Los Santos", "Radio X", "SF-UR", "WCTR"],
"Grand Theft Auto: Liberty City Stories" : ["Double Clef FM", "Flashback FM", "Head Radio", "K-Jah", "LCFR", "Lips 106", "MSX 98", "Radio Del Mundo", "Rise FM", "The Liberty Jam"],
"Grand Theft Auto: Vice City Stories" : ["Emotion 98.3", "Flash FM", "Fresh 105 FM", "Paradise FM", "Radio Espantoso", "The Wave 103", "V-Rock", "VCFL", "VCPR"],
"Grand Theft Auto IV" : ["Electro-Choc", "Fusion FM", "Integrity 2.0", "International Funk", "Jazz Nation Radio 108.5", "K109 The Studio", "Liberty City Hardcore", "Liberty Rock Radio 97.8", "Massive B Soundsystem 96.9", "PLR", "Radio Broker", "San Juan Sounds", "The Beat 102.7", "The Classics 104.1", "The Journey", "The Vibe 98.8", "Tuff Gong Radio", "WKTT Radio", "Vladivostok FM"],
"Grand Theft Auto: Episodes from Liberty City" : ["Electro-Choc", "Integrity 2.0", "Liberty City Hardcore", "Liberty Rock Radio 97.8", "K109 The Studio", "Radio Broker", "RamJam FM", "San Juan Sounds", "Self-Actualization FM", "The Beat 102.7", "Vice City FM", "Vladivostok FM", "WKTT Radio"],
"Grand Theft Auto: Chinatown Wars" : ["Alchemist", "Deadmau5", "Prairie Cartel", "Ticklah", "Truth & Soul", "Anvil", "DFA", "DJ Khalil", "Sinowav FM", "Tortoise", "Turntables on the Hudson"],
"Grand Theft Auto V" : ["Blaine County Talk Radio", "Channel X", "East Los FM", "FlyLo FM", "Los Santos Rock Radio", "Non Stop Pop FM", "Radio Los Santos", "Radio Mirror Park", "Rebel Radio", "Soulwax FM", "Space 103.2", "The Blue Ark", "The Lab", "The Low Down 91.1", "Vinewood Boulevard Radio", "WCTR 95.6", "West Coast Classics", "Worldwide FM"]
};
gtaPassedSounds = ["GTA 3 - Mission Complete.mp3", "GTA IV - Mission Complete 2.mp3", "GTA IV - Mission Complete.mp3", "Liberity City Stories - Mission Complete.mp3", "San Andreas - Mission Complete.mp3", "Vice City - Mission Complete.mp3", "Vice City Stories - Mission Complete.mp3", "wolf3d-yeah.mp3"];

const client = new tmi.client(options);

function randomNumber(max)
{
  return Math.floor((Math.random() * (max - 0)));
}

function randomRadio(game)
{
  radios = gtaRadios[game];
  returnStation = radios[randomNumber(radios.length)];
  return returnStation;
}

const simpleCommands = 
{
    purpose: {scope: 'mods', cooldown: 'TODO', result: 'I pass butter'},
    list: {scope: 'all', cooldown: 'TODO', result: 'https://docs.google.com/spreadsheets/d/1sAjqGOPH3fosstrF-mBFqMA8Bv5WCpz-wFFDnV_5k6U/edit#gid=1081070171'}
};

async function beatGame(beatComments, beatChannel)
{
    const doc = new GoogleSpreadsheet(botSettings.beatSpreadSheetID);
    await doc.useServiceAccountAuth({client_email: botSettings.googleSheetsClientEmail, private_key: botSettings.googleSheetsPrivateKey});
    await doc.loadInfo();

    let now = new Date();
    let beatTimestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    let beatSheet = await doc.sheetsById[botSettings.beatSheetID];

    let lookupChannel = beatChannel.substr(1);
    let channelID = await twitchAPI.getChannelID(lookupChannel);
    let gameName = await twitchAPI.getCurrentGame(channelID);            
    if(gameName)
    {
        if(beatComments.length > 0)
        {
            let commentsString = '';
            beatComments.forEach(comment => { commentsString += `${comment} `;});
            let beatGameArray = [gameName, beatTimestamp, commentsString];
            await beatSheet.addRow(beatGameArray)
            .catch(error => {console.log(error);});
            client.say(beatChannel, `Added ${gameName} (${commentsString}) to list`);
        }
        else
        {
            let beatGameArray = [gameName, beatTimestamp];
            await beatSheet.addRow(beatGameArray)
            .catch(error => {console.log(error);});
            client.say(beatChannel, `Added ${gameName} to list`);
        }
    }
    else
    {
        console.log('gameName is empty or does not exist');
    }
}

async function runCommand(targetChannel, fromMod, context, inputCmd, args)
{
    cmd = inputCmd.substr(1);

    if(cmd in simpleCommands)
    {
        // console.log('found command ' + cmd + ' in simple commands');
        if(simpleCommands[cmd].scope == 'mods' && !fromMod)
        {
            console.log(`User ${context['display-name']} tried to use the mod only command ${cmd}`);
            return;
        }
        else
        {
            // console.log(simpleCommands[cmd].result);
            client.say(targetChannel, simpleCommands[cmd].result);
            return;
        }
    }
    else if(cmd == 'getgame')
    {
        let lookupChannel = targetChannel.substr(1);
        let channelID = await twitchAPI.getChannelID(lookupChannel);
        let gameName = await twitchAPI.getCurrentGame(channelID);
        console.log(gameName);
    }
    else if(cmd == 'beat')
    {
        if(fromMod)
        {           
            await beatGame(args, targetChannel)
            .catch(error => {console.log(error);});
        }
        else
        {
            client.say(targetChannel, `${context['display-name']} does not have permission to run this command`);
        }
    }
    else if(cmd == 'radio')
    {
        // currentGame = 'Grand Theft Auto: Vice City Stories';
        let lookupChannel = targetChannel.substr(1);
        let channelID = await twitchAPI.getChannelID(lookupChannel);
        let currentGame = await twitchAPI.getCurrentGame(channelID);            
        if(threedUniverseGames.includes(currentGame) || hdUniverseGames.includes(currentGame))
        {
            try
            {
                radioResult = randomRadio(currentGame);
                client.say(targetChannel, radioResult);
            }
            catch(error){console.log(error);}         
            return;   
        }
        else
        {
            // client.say(targetChannel, 'This is not a GTA game.');
            client.say(targetChannel, `${currentGame} is not a GTA game.`);
            return;
        }
    }
    else
    {
        console.log(`Read command ${cmd} (args: ${args}) from ${context['display-name']}, command not found.`);
        return;
    }
}

function isMod(checkMsg)
{
    if(checkMsg.mod){return true;}
    else if(checkMsg.badges && checkMsg.badges.broadcaster) {return true;}
    else{return false;}
}

client.connect();

client.on('connected', (address, port) => {
    console.log(`Chatbot (${options.identity.username}) connected to ${address}:${port}`);
});

client.on('message', (target, context, msg, self) => {
    if(self) { return; } // bot dees not need to interact with itself
    // console.log(context);
    console.log(context['display-name'] + ': ' + msg);
    if(msg.startsWith('!')) { 
        cmdArray = msg.split(' ');
        if(isMod(context))
        {
            runCommand(target, true, context, cmdArray[0], cmdArray.slice(1));
        }
        else
        {
            runCommand(target, false, context, cmdArray[0], cmdArray.slice(1));
        }
    }
});

