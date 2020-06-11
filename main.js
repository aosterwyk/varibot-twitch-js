const soundPlayer = require('play-sound')(opts = {player: 'mplayer.exe'});
const tmi = require('tmi.js');
const pubsubBot = require('./utils/pubsub');
const botSettings = require('./botSettings.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getRandomOwnedGame } = require('./utils/ownedGames');
const twitchAPI = require('./utils/api');
const chalk = require('chalk');

if(botSettings.password.length < 1) { 
    console.log(chalk.red('Invalid auth token. Please authorize the bot using the link below and paste your token under password in bot settings.'));
    console.log(`https://id.twitch.tv/oauth2/authorize?client_id=${botSettings.clientID}&redirect_uri=https://acceptdefaults.com/twitch-oauth-token-generator/&response_type=token&scope=bits:read+channel:read:redemptions+channel:moderate+chat:edit+chat:read+user:edit:broadcast`);
    process.exit();
}

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

console.log(`${chalk.blueBright('V')}${chalk.cyanBright('a')}${chalk.blueBright('r')}${chalk.cyanBright('i')}${chalk.blueBright('B')}${chalk.cyanBright('o')}${chalk.blueBright('t')}`); 

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomRadio(game) {
  radios = gtaRadios[game];
  returnStation = radios[randomNumber(0,radios.length)];
  return returnStation;
}

const simpleCommands =  {
    purpose: {scope: 'mods', cooldown: 'TODO', result: 'I pass butter'},
    list: {scope: 'all', cooldown: 'TODO', result: 'https://docs.google.com/spreadsheets/d/1sAjqGOPH3fosstrF-mBFqMA8Bv5WCpz-wFFDnV_5k6U/edit#gid=1081070171'}
};

async function beatGame(beatComments, beatChannel) {        
    const doc = new GoogleSpreadsheet(botSettings.beatSpreadSheetID);
    await doc.useServiceAccountAuth({client_email: botSettings.googleSheetsClientEmail, private_key: botSettings.googleSheetsPrivateKey});
    await doc.loadInfo();

    let now = new Date();
    let beatTimestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    let beatSheet = await doc.sheetsById[botSettings.beatSheetID];

    let lookupChannel = beatChannel.substr(1);
    let channelID = await twitchAPI.getChannelID(lookupChannel);
    let gameName = await twitchAPI.getCurrentGame(channelID);            
    if(gameName) {
        if(beatComments.length > 0) {
            let commentsString = '';
            beatComments.forEach(comment => { commentsString += `${comment} `;});
            let beatGameArray = [gameName, beatTimestamp, commentsString];
            await beatSheet.addRow(beatGameArray)
            .catch(error => {console.log(chalk.red(error));});
            client.say(beatChannel, `Added ${gameName} (${commentsString}) to list`);
            console.log(chalk.cyan(`Added ${gameName} (${commentsString}) to list`));
            let channelId = await twitchAPI.getChannelID(targetChannel.substr(1));
            await twitchAPI.createStreamMarker(channelId,'test with id from api');
            console.log(chalk.cyan('Created stream marker'));            
            soundPlayer.play(`${botSettings.soundsDir}/${botSettings.beatGameSound}`); // if this dies check that mplayer.exe is in %appdata%\npm 
        }
        else {
            let beatGameArray = [gameName, beatTimestamp];
            await beatSheet.addRow(beatGameArray)
            .catch(error => {console.log(chalk.red(error));});
            client.say(beatChannel, `Added ${gameName} to list`);
            console.log(chalk.cyan(`Added ${gameName} to list`));
            let channelId = await twitchAPI.getChannelID(targetChannel.substr(1));
            await twitchAPI.createStreamMarker(channelId,'test with id from api');
            console.log(chalk.cyan('Created stream marker'));
            soundPlayer.play(`${botSettings.soundsDir}/${botSettings.beatGameSound}`); // if this dies check that mplayer.exe is in %appdata%\npm 
        }
    }
    else {
        console.log(chalk.red('gameName is empty or does not exist'));
    }
}

async function runCommand(targetChannel, fromMod, context, inputCmd, args) {
    let cmd = inputCmd.toLowerCase();

    if(cmd in simpleCommands) {
        if(simpleCommands[cmd].scope == 'mods' && !fromMod) {
            console.log(`User ${context['display-name']} tried to use the mod only command ${cmd}`);
            return;
        }
        else {
            client.say(targetChannel, simpleCommands[cmd].result);
            return;
        }
    }
    else if(cmd == 'randomgame') { 
        // check that the spreadsheet is not called template
        let searchPlatform = '';
        args.forEach(searchString => searchPlatform += searchString);
        if(searchPlatform.length > 0) {
            searchPlatform = searchPlatform.trim();
        }
        else {
            searchPlatform = 'genesis';
        }
        let randomGame = await getRandomOwnedGame(botSettings.googleSheetsClientEmail, botSettings.googleSheetsPrivateKey, botSettings.ownedGamesSpreadSheetID,searchPlatform);
        randomGame ? client.say(targetChannel, `${randomGame}`) : console.log(chalk.red('could not find game'));
    }
    else if(cmd == 'multi') { 
        let channelId = await twitchAPI.getChannelID(targetChannel.substr(1));
        let channelTitle = await twitchAPI.getStreamTitle(channelId);
        let multiLink = `https://multistre.am/${botSettings.channel}/`
        if(channelTitle.includes('!multi') && channelTitle.includes('@')) { 
            let mentionLocation = channelTitle.search('@');
            if(mentionLocation != -1) {
                let multiChannels = channelTitle.slice(mentionLocation);
                multiChannels = multiChannels.trim().split(' ');
                multiChannels.forEach((chan, c) => {
                  if(chan.includes('@') && chan.length > 4) {
                    multiLink += `${(chan.slice(1)).trim()}/`;
                  }
                });
            }
        }
        else { 
            console.log(chalk.red('Topic does not have !multi and @ in title'));
        }
    }
    else if(cmd == 'beat') {
        if(fromMod) {           
            await beatGame(args, targetChannel)
            .catch(error => {console.log(chalk.red(error));});
        }
        else{
            client.say(targetChannel, `${context['display-name']} does not have permission to run this command`);
        }
    }
    else if(cmd == 'radio') {
        let lookupChannel = targetChannel.substr(1);
        let channelID = await twitchAPI.getChannelID(lookupChannel);
        let currentGame = await twitchAPI.getCurrentGame(channelID);            
        if(threedUniverseGames.includes(currentGame) || hdUniverseGames.includes(currentGame)) {
            try {
                radioResult = randomRadio(currentGame);
                client.say(targetChannel, radioResult);
            }
            catch(error){console.log(chalk.red(error));}         
            return;   
        }
        else {
            client.say(targetChannel, `${currentGame} is not a GTA game.`);
            return;
        }
    }
    else {
        console.log(chalk.grey(`Read command ${cmd} (args: ${args}) from ${context['display-name']}, command not found.`));
        return;
    }
}

function isMod(checkMsg) {
    if(checkMsg.mod){return true;}
    else if(checkMsg.badges && checkMsg.badges.broadcaster) {return true;}
    else{return false;}
}

client.connect();

client.on('connected', (address, port) => {
    console.log(chalk.green(`Chatbot (${chalk.greenBright(options.identity.username)}) connected to ${address}:${port}`));
});

client.on('message', async (target, context, msg, self) => {
    if(self) { return; } // bot does not need to interact with itself
    // console.log(context['tmi-sent-ts']);
    let msgTime = new Date();
    console.log(`[${msgTime.getHours()}:${msgTime.getMinutes()}]${context['display-name']}: ${msg}`);
    if(msg.startsWith('!')) { 
        cmdArray = msg.slice(1).split(' ');
        if(isMod(context)) {
            await runCommand(target, true, context, cmdArray[0], cmdArray.slice(1));
        }
        else {
            await runCommand(target, false, context, cmdArray[0], cmdArray.slice(1));
        }
    }
});

