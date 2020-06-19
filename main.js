const tmi = require('tmi.js');
const { botSettingsDB } = require('./db/botSettingsDB');
const { simpleCommandsDB } = require('./db/simpleCommandsDB');
const { channelPointsSoundsDB } = require('./db/channelPointSoundsDB');
// const botSettingsFile = require('./botSettings.json');
const chalk = require('chalk');
const { loadSounds } = require('./utils/loadSounds');
// const enabledCommands = require('./enabledCommands.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getRandomOwnedGame } = require('./utils/ownedGames');
const twitchAPI = require('./utils/api');
const WebSocket = require('ws');
const pubsubSocket = new WebSocket('wss://pubsub-edge.twitch.tv');
const { getChannelID } = require('./utils/api');

let client = null;
let botSettings = {};
let commands = {};
let channelPointsSounds = {};
let channelPointsFilenames = []; // add beat game sound to this
let randomSounds = [];
let lastRunTimestamp = new Date(); // hacky cooldown 

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

console.log(`${chalk.blueBright('V')}${chalk.cyanBright('a')}${chalk.blueBright('r')}${chalk.cyanBright('i')}${chalk.blueBright('B')}${chalk.cyanBright('o')}${chalk.blueBright('t')}`); 

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomRadio(game) {
  radios = gtaRadios[game];
  returnStation = radios[randomNumber(0,radios.length)];
  return returnStation;
}

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
        // TO DO - clean this up 
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
            // soundPlayer.play(`${botSettings.soundsDir}/${botSettings.beatGameSound}`); // if this dies check that mplayer.exe is in %appdata%\npm 
            win.webContents.executeJavaScript(`playSound('${botSettings.beatGameSound}')`);
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
            // soundPlayer.play(`${botSettings.soundsDir}/${botSettings.beatGameSound}`); // if this dies check that mplayer.exe is in %appdata%\npm 
            win.webContents.executeJavaScript(`playSound('${botSettings.beatGameSound}')`);
        }
    }
    else {
        console.log(chalk.red('gameName is empty or does not exist'));
    }
}

async function runCommand(targetChannel, fromMod, context, inputCmd, args) {   
    let cmd = inputCmd.toLowerCase();
    // check if command is enabled when checking cooldown 
    let checked = await checkCooldown(lastRunTimestamp);
    if(checked) {  
        lastRunTimestamp = new Date();
        if(cmd in commands) {
            if(!commands[cmd].enabled) { 
                console.log(`Found command ${cmd} but it is disabled. Skipping.`);            
                return;
            }
            if(commands[cmd].scope == 'mods' && !fromMod) {
                console.log(`User ${context['display-name']} tried to use the mod only command ${cmd}`);
                return;
            }
            else {
                if(commands[cmd].cmdType == 'simple') {
                    client.say(targetChannel, commands[cmd].result);
                    return; 
                }
            }
        }
        // if(!enabledCommands[cmd]) {
        //     console.log(`Found command ${cmd} but it is disabled. Skipping.`);
        //     return;
        // }
        if(cmd == 'shuffle') { 
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
        else if(cmd == 'list') {
            client.say(targetChannel, `https://docs.google.com/spreadsheets/d/${botSettings.beatSpreadSheetID}`);
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
                    client.say(targetChannel,`${multiLink}`);
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
    else { 
        console.log(chalk.grey(`commands still on cooldown`));
    }
}

async function checkCooldown(lastRun) { 
    let now = new Date();
    let lastRunDate = new Date(lastRun);
    let nextRunDate = new Date(lastRunDate.getTime() + (botSettings.cooldown * 1000));

    if(now > nextRunDate) { 
        return true;
    }
    return false;
}

function isMod(checkMsg) {
    if(checkMsg.mod){return true;}
    else if(checkMsg.badges && checkMsg.badges.broadcaster) {return true;}
    else{return false;}
}

async function loadChannelPointsSounds() { 
    await channelPointsSoundsDB.sync();
    let dbResult = await channelPointsSoundsDB.findAll();
    for(let x = 0; x < dbResult.length; x++) {
        channelPointsSounds[dbResult[x].name] = {
            name: dbResult[x].name,
            filename: dbResult[x].filename
        }
        channelPointsFilenames.push(dbResult[x].filename);        
    }
    console.log(`Loaded ${dbResult.length} channel points sounds`);
}

async function loadSimpleCommands() {
    await simpleCommandsDB.sync();
    let dbResult = await simpleCommandsDB.findAll();
    for(let x = 0; x < dbResult.length; x++) {
        commands[dbResult[x].name] = {
            enabled: dbResult[x].enabled,
            scope: dbResult[x].scope,
            cooldown: dbResult[x].cooldown,
            enabled: dbResult[x].enabled,
            result: dbResult[x].result,
            cmdType: 'simple'
        }
    }
    console.log(`Loaded ${dbResult.length} commands`);
}   

async function updateBotSettings(option, newValue) { 
    await botSettingsDB.sync();
    await botSettingsDB.update({
        [option]: newValue,
    }, {
        where: {
            id: 1
        }
    });  
}

async function startBot() { 
    await botSettingsDB.sync();
    let botset = await botSettingsDB.findAll(); 
    botSettings = botset[0];

    await loadSimpleCommands();

    if(botSettings === undefined) { 
        console.log('Bot settings are empty. Please run setup.');
        process.exit();
    }

    if(botSettings.clientId === undefined || botSettings.clientId.length < 1) { 
        console.log('Invalid client ID in bot settings. Please run setup.');
        process.exit();
    }

    if(botSettings.token.length < 1) { 
        console.log(chalk.red('Invalid auth token. Please use the link below to authorize the bot and get a token.'));
        console.log(`https://id.twitch.tv/oauth2/authorize?client_id=${botSettings.clientId}&redirect_uri=https://acceptdefaults.com/twitch-oauth-token-generator/&response_type=token&scope=bits:read+channel:read:redemptions+channel:moderate+chat:edit+chat:read+user:edit:broadcast`);
        process.exit();
    } 

    if(botSettings.channel === undefined || botSettings.channel.length < 1) { 
        console.log('Invalid channel in bot settings. Please run setup.');
        process.exit();
    }

    await loadChannelPointsSounds();
    if(botSettings.soundsDir.length > 1) {
        randomSounds = await loadSounds(botSettings.soundsDir, channelPointsFilenames);
    }
    else {
        console.log(`No sounds directory found in settings. Skipping loading random sounds.`);
    }


    const options = {
        identity: {
            username: botSettings.username,
            password: botSettings.token
        },
        channels: [botSettings.channel]
    }; 
    client = new tmi.client(options);    
    client.connect();
    client.on('connected', (address, port) => {
        console.log(chalk.green(`Chatbot (${chalk.greenBright(options.identity.username)}) connected to ${address}:${port}`));
    });

    client.on('message', async (target, context, msg, self) => {
        if(self) { return; }
        let msgTime = new Date();
        statusMsg(`[${msgTime.getHours()}:${msgTime.getMinutes()}]${context['display-name']}: ${msg}`);
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
}

// electron start

const { ipcMain, app, BrowserWindow } = require('electron');
const ipc = ipcMain;

let logoURL = 'https://acceptdefaults.com/varibot-twitch-js/varibot.png';
var win = null;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 1200,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('index.htm');

    win.webContents.openDevTools()
    win.webContents.executeJavaScript(`updateSoundsList()`);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
app.on('activate', () => {
if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
}
});

ipc.on('firstLoad', (event, args) => {
    let firstLoad = `<img src='${logoURL}' />`;
    event.returnValue = firstLoad;
});

ipc.handle('botSettingsFromForm', async (event, args) => {
    // TO DO - change names to match and run this through a loop - skip any blank values
    if(args.botUsername.length > 1) {
        await updateBotSettings('username', args.botUsername);
    }
    if(args.botToken.length > 1) {
        await updateBotSettings('token', args.botToken);
    }
    if(args.clientId.length > 1) {        
        await updateBotSettings('clientId', args.clientId);
    }
    if(args.channel.length > 1) {        
        await updateBotSettings('channel', args.channel);
    }
    if(args.soundsDir.length > 1) {        
        await updateBotSettings('soundsDir', args.soundsDir);
    }
    if(args.googleSheetsClientEmail.length > 1) {    
        await updateBotSettings('googleSheetsClientEmail', args.googleSheetsClientEmail);
    }
    if(args.googleSheetsPrivateKey.length > 1) {    
        await updateBotSettings('googleSheetsPrivateKey', args.googleSheetsPrivateKey);
    }
    if(args.beatSheetID.length > 1) {    
        await updateBotSettings('beatSheetID', args.beatSheetID);
    }
    if(args.beatSpreadSheetID.length > 1) {
        await updateBotSettings('beatSpreadSheetID', args.beatSpreadSheetID);
    }
    if(args.beatSheetID.length > 1) {
        await updateBotSettings('beatSheetID', args.beatSheetID);
    }
    if(args.beatGameSound.length > 1) {
        await updateBotSettings('beatGameSound', args.beatGameSound);
    }
    // await updateBotSettings(ownedGamesSpreadSheetID, args.ownedGamesSpreadSheetID);
    statusMsg(`Settings updated. You will need to restart if your token was updated.`);
    win.webContents.executeJavaScript(`showPage('home')`);
    return true;
});

ipc.handle('loadSounds', async (event, args) => {
    let returnSounds = [...randomSounds, ...channelPointsFilenames];
    return returnSounds;
});

ipc.handle('getCurrentSettings', async (event, args) => {
    await botSettingsDB.sync();
    let dbSettings = await botSettingsDB.findAll(); 
    let result = {
        username: dbSettings[0].username,
        token: dbSettings[0].token,
        clientId: dbSettings[0].clientId,
        channel: dbSettings[0].channel,
        cooldown: dbSettings[0].cooldown,
        soundsDir: dbSettings[0].soundsDir,
        googleSheetsClientEmail: dbSettings[0].googleSheetsClientEmail,
        googleSheetsPrivateKey: dbSettings[0].googleSheetsPrivateKey,
        beatSheetID: dbSettings[0].beatSheetID,
        beatSpreadSheetID: dbSettings[0].beatSpreadSheetID,
        beatGameSound: dbSettings[0].beatGameSound,
        ownedGamesSpreadSheetID: dbSettings[0].ownedGamesSpreadSheetID
    }
    return result;
});

function statusMsg(msg) { 
    win.webContents.send('status', msg);
    console.log(msg);
}

// electron end

// pubsub start

function proecssReward(reward) {
    statusMsg('Reward ' + reward.data.redemption.reward.title + ' was redeemed by ' + reward.data.redemption.user.display_name + ' for ' + reward.data.redemption.reward.cost + ' points');
    if(reward.data.redemption.reward.title.toLowerCase() == 'random sound') {
        // add a while loop to re-roll random if it picks the same sound twice or the beat game sound
        let randomIndex = Math.floor(Math.random() * Math.floor(randomSounds.length));
        win.webContents.executeJavaScript(`playSound('${randomSounds[randomIndex]}')`);
        statusMsg(`Playing sound ${randomSounds[randomIndex]}`);
    }
    else {
        for(let s in channelPointsSounds) {
            if(channelPointsSounds[s].name.toLowerCase() == reward.data.redemption.reward.title.toLowerCase()) {
                win.webContents.executeJavaScript(`playSound('${channelPointsSounds[s].filename}')`);
                statusMsg(`Playing sound ${channelPointsSounds[s].name} (${channelPointsSounds[s].filename})`);
                break;
            }   
        }
    }
}

function pubsubHandle(msg) {
    if(msg.type == 'MESSAGE') {
        pubsubMessage = JSON.parse(msg.data.message);
        if(pubsubMessage.type == 'reward-redeemed') {
            proecssReward(pubsubMessage);
        }
    }
}

function pubsubPings() {
    pubsubSocket.send(JSON.stringify({type:"PING"}));
    setTimeout(pubsubPings,120000); // 2 minutes
}

pubsubSocket.onopen = async function(e) {
    let channelId = await getChannelID(botSettings.channel);
    let connectMsg =  {
        type: "LISTEN",
        nonce: "44h1k13746815ab1r2",
        data:  {
          topics: ["channel-points-channel-v1." + channelId],
          auth_token: botSettings.token
        }
    };
    pubsubSocket.send(JSON.stringify(connectMsg));
    console.log(chalk.green(`Pubsub connected. Listed topics: ${connectMsg.data.topics}`));
    pubsubPings();
};

pubsubSocket.onmessage = function(event)  {
    pubsubResonse = JSON.parse(event.data);
    pubsubHandle(pubsubResonse);
};

// pubsub end


startBot();

