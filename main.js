const fs = require('fs');
const tmi = require('tmi.js');
const WebSocket = require('ws');
const twitchAPI = require('./utils/api');
const pubsubSocket = new WebSocket('wss://pubsub-edge.twitch.tv');
const { autoUpdater } = require('electron-updater');
const { checkConfigDir } = require('./utils/config/checkConfigDir');
const { randomRadio, isGTAGame } = require('./utils/gta/gtaCmds');
const { loadSounds } = require('./utils/loadSounds');
const { getRandomOwnedGame } = require('./utils/ownedGames');
const { beatGame } = require('./utils/beatGame');
const { getMultiLink } = require('./utils/multiLink');
const { isMod } = require('./utils/isMod');
const { getSpreadsheetInfo } = require('./utils/getSpreadsheetInfo');
const { getBotSettings } = require('./utils/config/getBotSettings');
const { setBotSettings } = require('./utils/config/setBotSettings');
const { getChannelPointsSounds } = require('./utils/config/getChannelPointsSounds');
const { setChannelPointsSounds } = require('./utils/config/setChannelPointsSounds');
const versionNumber = require('./package.json').version;



const { ipcMain, app, dialog, BrowserWindow } = require('electron');
// const ipcMain = ipcMain;
var win = null;

// TO DO - change to globals? 
let client = null;
let commands = {};
let botSettings = {};
let randomSounds = [];
let readyToConnect = true;
let channelPointsSounds = {};
let channelPointsFilenames = []; // add beat game sound to this
const configsDir = `${app.getPath('appData')}\\varibot\\configs`;
checkConfigDir(configsDir);
const soundsDir = `${app.getPath('appData')}\\varibot\\sounds`;
checkConfigDir(soundsDir);

let googleCredsExist = false;
const googleCredsFilePath = `${app.getPath('appData')}\\varibot\\googleCreds.json`;
const botSettingsFilePath = `${app.getPath('appData')}\\varibot\\configs\\botSettings.json`;
const windowSettingsFilePath = `${app.getPath('appData')}\\varibot\\configs\\windowSettings.json`;
const soundsSettingsFilePath = `${app.getPath('appData')}\\varibot\\configs\\soundsSettings.json`;

let lastRunTimestamp = new Date(); // hacky cooldown


function checkGoogleCreds() {
    if (fs.existsSync(googleCredsFilePath)) { 
        googleCreds = require(`${app.getPath('appData')}\\varibot\\googleCreds`);
        googleCredsExist = true;
    }
    else {
        googleCredsExist = false;
    }
}

console.log(`VariBot ${versionNumber}`);

async function runCommand(targetChannel, fromMod, context, inputCmd, args) {   
    let cmd = inputCmd.toLowerCase();
    // check if command is enabled when checking cooldown 
    // let checked = await checkCooldown(lastRunTimestamp);
    // if(checked) {  
    if(commands[cmd] !== undefined) {
        if(!commands[cmd].enabled) { 
            console.log(`Command ${cmd} is disabled`);
            return;
        }        
        lastRunTimestamp = new Date();
        if(cmd in commands) {
            // if(!commands[cmd].enabled) { 
            //     console.log(`Found command ${cmd} but it is disabled. Skipping.`);            
            //     return;
            // }
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
        if(cmd == 'shuffle') { 
            // TO DO - check that the spreadsheet is not called template
            let searchPlatform = '';
            args.forEach(searchString => searchPlatform += searchString);
            if(searchPlatform.length > 0) {
                searchPlatform = searchPlatform.trim();
            }
            else {
                searchPlatform = 'genesis';
            }
            let randomGame = await getRandomOwnedGame(botSettings.googleSheetsClientEmail, botSettings.googleSheetsPrivateKey, botSettings.ownedGamesSpreadSheetID,searchPlatform);
            randomGame ? client.say(targetChannel, `${randomGame}`) : console.log('could not find game');
        }
        else if(cmd == 'list') {
            client.say(targetChannel, `https://docs.google.com/spreadsheets/d/${botSettings.beatSpreadSheetID}`);
        }
        else if(cmd == 'multi') { 
            let multiLink = await getMultiLink(botSettings.channel, botSettings.clientId, botSettings.token);
            if(multiLink !== undefined) {
                client.say(targetChannel,`${multiLink}`);
            }
        }
        else if(cmd == 'beat') {
            checkGoogleCreds();
            if(googleCredsExist) {
                if(fromMod) {           
                    let beatMsg = await beatGame(args, targetChannel, botSettings.beatSpreadSheetID, botSettings.clientId, botSettings.token, googleCredsFilePath)
                    .catch(error => {console.log(error);});
                    client.say(targetChannel, beatMsg);
                    statusMsg('success', beatMsg);
                    // updateRecentEvents(beatMsg);
                    win.webContents.executeJavaScript(`playSound('${botSettings.beatGameSound}')`);
                }
                else{
                    client.say(targetChannel, `${context['display-name']} does not have permission to run this command`);
                }
            }
            else {
                statusMsg('error', `Could not find Google creds file.`);
            }
        }
        else if(cmd == 'radio') {
            let lookupChannel = targetChannel.substr(1);
            let channelId = await twitchAPI.getChannelID(lookupChannel, botSettings.clientId, botSettings.token);
            // let currentGame = await twitchAPI.getCurrentGame(channelId, botSettings.clientId, botSettings.token); //v5
            let channelInfo = await twitchAPI.getStreamInfo(channelId, botSettings.clientId, botSettings.token);
            let currentGame = channelInfo.game_name; //v6
            if(isGTAGame(currentGame)) {
                try {
                    let radioResult = randomRadio(currentGame);
                    client.say(targetChannel, radioResult);
                    statusMsg('special', `Random radio: ${radioResult}`);
                }
                catch(error){console.log(error);}         
                return;   
            }
            else {
                statusMsg('error', `${currentGame} is not a GTA game`);
                return;
            }
        }
        else {
            console.log(`Read command ${cmd} (args: ${args}) from ${context['display-name']}, command not found.`);
            return;
        }
    }
    else { 
        console.log(`Command ${cmd} not found`);
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

async function loadChannelPointsSounds() { 
    channelPointsSounds = {};
    channelPointsFilenames = [];
    let soundsFromFile = await getChannelPointsSounds(soundsSettingsFilePath);
    if(soundsFromFile !== undefined) {
        for(let key in soundsFromFile){
            channelPointsSounds[key] = {
                name: key,
                filename: soundsFromFile[key]
            }
            channelPointsFilenames.push(soundsFromFile[key]);
        }
        console.log(`Loaded ${Object.keys(channelPointsSounds).length} channel reward sounds`);
    }
}

async function loadCommands() {
    console.log(`Loading commands...`);
    botSettings = await getBotSettings(botSettingsFilePath);
    let builtinCmds = ['shuffle', 'list', 'multi', 'beat', 'radio'];
    for(let x = 0; x < builtinCmds.length; x++) {
        let foundCmd = false;
        for(key in botSettings) { 
            if(key.toLowerCase() == builtinCmds[x].toLowerCase()) {
                commands[key] = {
                    name: key,
                    enabled: botSettings[key]
                }
                foundCmd = true;
            }
        }
        if(!foundCmd) {
            commands[builtinCmds[x]] = {
                name: builtinCmds[x],
                enabled: false
            }
            console.log(`Did not find command ${builtinCmds[x]} in bot settings, creating command.`);
            await setBotSettings(botSettingsFilePath, builtinCmds[x], false);
            console.log(`Added command ${builtinCmds[x]} to bot settings file.`);
        }
    }
    console.log(`Loaded ${Object.keys(commands).length} commands`);
}   

async function startBot() { 
    let botSettings = await getBotSettings(botSettingsFilePath);

    checkGoogleCreds();
    if(googleCredsExist) {
        botSettings.googleSheetsClientEmail = googleCreds.client_email;
        botSettings.googleSheetsPrivateKey = googleCreds.private_key;
    }

    await loadCommands();

    if(botSettings === undefined) { 
        console.log('Bot settings are empty. Please run setup.');
        readyToConnect = false;
    }
    else {
        if(botSettings.clientId === undefined || botSettings.clientId.length < 1) { 
            console.log('Invalid client ID in bot settings. Please run setup.');
            readyToConnect = false;
        }

        if(botSettings.token === undefined || botSettings.token.length < 1) { 
            readyToConnect = false;
            statusMsg(`error`,`Invalid bot settings. Please run setup.`);        
        } 

        if(botSettings.channel === undefined || botSettings.channel.length < 1) { 
            console.log('Invalid channel in bot settings. Please run setup.');
            readyToConnect = false;
        }
        await loadChannelPointsSounds();
        if(soundsDir === undefined || soundsDir.length > 1) {
            randomSounds = await loadSounds(soundsDir, channelPointsFilenames);
        }
        else {
            console.log(`No sounds directory found in settings. Skipping loading random sounds.`);
        }        
    }

    if(readyToConnect) {
        const options = {
            identity: {
                username: botSettings.username,
                password: botSettings.token
            },
            channels: [botSettings.channel]
        }; 
        client = new tmi.client(options);    
        client.connect()
        .catch((error) => {
            if(error.includes('Login authentication failed')) {
                let errorString = `Invalid token. Please get a new token and update bot settings.`;
                statusMsg('error', errorString);
                win.webContents.executeJavaScript(`showPage('settings')`);
                win.webContents.executeJavaScript(`alertMsg(true, 'error', '${errorString}')`);        
                win.webContents.executeJavaScript(`setConnectionStatus('chatBot', 'error', 'Invalid token. Please get a new token and update bot settings.')`);           
            }
            else {
                statusMsg('error', `Error connecting: ${error}`);
                win.webContents.executeJavaScript(`setConnectionStatus('chatBot', 'error', '${error}')`);                
            }
            return;
        });
        client.on('connected', (address, port) => {
            let chatbotConnectedMessage = `Chatbot (${options.identity.username}) connected to ${address}:${port}`;
            // console.log(chatbotConnectedMessage);
            win.webContents.executeJavaScript(`setConnectionStatus('chatBot', 'connected', 'none')`);      
            statusMsg('info', chatbotConnectedMessage);
        });

        client.on('message', async (target, context, msg, self) => {
            if(self) { return; }
            let msgTime = new Date();
            statusMsg(`info`, `[${msgTime.getHours()}:${msgTime.getMinutes()}]${context['display-name']}: ${msg}`);
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
        
        client.on("disconnected", (reason) => {
            statusMsg('error', `Chatbot disconnected: ${reason}`);
            win.webContents.executeJavaScript(`setConnectionStatus('chatBot', 'error', 'Disconnected: ${reason}')`);                
            win.webContents.executeJavaScript(`alertMsg(true, 'error', 'Chatbot disconnected: ${reason}')`);            
        });


        pubsubSocket.onopen = async function(e) {
            botSettings = await getBotSettings(botSettingsFilePath);            
            if(botSettings !== undefined) {
                try {
                    let channelId = await twitchAPI.getChannelID(botSettings.channel, botSettings.clientId, botSettings.token);
                    let connectMsg =  {
                        type: "LISTEN",
                        nonce: "44h1k13746815ab1r2",
                        data:  {
                        topics: ["channel-points-channel-v1." + channelId],
                        auth_token: botSettings.token
                        }
                    };
                    pubsubSocket.send(JSON.stringify(connectMsg));
                    let pubsubConnectedMessage = `Pubsub connected. Listed topics: ${connectMsg.data.topics}`;
                    // console.log(pubsubConnectedMessage);
                    statusMsg('info', pubsubConnectedMessage);
                    win.webContents.executeJavaScript(`setConnectionStatus('pubsub', 'connected', 'none')`);                                
                    pubsubPings();
                }
                catch(error) {
                    console.log(error);
                    statusMsg('error', `Pubsub connection error: ${error}`);
                    win.webContents.executeJavaScript(`setConnectionStatus('pubsub', 'error', '${error}')`);                                                      
                }
            }
        };
        
        win.webContents.executeJavaScript(`updateSoundsList()`);
        win.webContents.executeJavaScript(`showPage('home')`);        

    }
    else {
        win.webContents.executeJavaScript(`showPage('settings')`);
        win.webContents.executeJavaScript(`alertMsg(true, 'error', 'Invalid bot settings. Please update settings and restart bot.')`);        
    }
}

// electron start

async function createWindow() {
    let newWindowSettings = await getBotSettings(windowSettingsFilePath);
    if(!newWindowSettings.successful) {
        newWindowSettings.window = {
            width: 1200,
            height: 800
        };
    }
    win = new BrowserWindow({
        // width: 1200,
        // height: 800,
        // width: 1500,
        // height: 1000,
        width: newWindowSettings.window.width,
        height: newWindowSettings.window.height,
        x: newWindowSettings.window.x,
        y: newWindowSettings.window.y,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');
    win.setMenu(null);
    win.webContents.openDevTools(); // TO DO - comment out before commit 
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

ipcMain.handle('getChannelRewards', async () => {
    let channelRewards = await twitchAPI.getChannelRewards(botSettings.channel, botSettings.clientId, botSettings.token);
    return channelRewards.data;
});

ipcMain.handle('runAd', async (event) => {
    let channelId = await twitchAPI.getChannelID(botSettings.channel, botSettings.clientId, botSettings.token);    
    if(channelId !== undefined) {
        const adResult = await twitchAPI.runAd(channelId, botSettings.clientId, botSettings.token, 90);
        // console.log(adResult);
        if(adResult.result) {
            statusMsg(`success`, `Running a ${adResult.adLength} second ad`);
            // updateRecentEvents(`You ran a ${adResult.adLength} second ad. Next ad can run in ${adResult.retry_after} seconds.`);            
            updateRecentEvents('you', 'you', `ran a ${adResult.adLength} second ad. Next ad can run in ${adResult.retry_after} seconds.`);
        }
        else {
            statusMsg(`error`, `Error running ad: ${adResult.message}`);
            if((adResult.message).search(`Missing scope`) !== -1) { 
                statusMsg(`error`, `Missing scope for command. Please create a new token by clicking Get Token in the settings page. DO NOT DO THIS WHILE LIVE!`);
            }
            // updateRecentEvents(`Error running ad. Check status box below for details`);
            updateRecentEvents('system', 'system', `Error running ad. Check status box below for details`);
        }
    }
});

ipcMain.handle('createStreamMarker', async (event) => {
    let channelId = await twitchAPI.getChannelID(botSettings.channel, botSettings.clientId, botSettings.token);    
    if(channelId !== undefined) {
        const markerResult = await twitchAPI.createStreamMarker(channelId, botSettings.clientId, botSettings.token, `Created from VariBot quick actions`)
        if(markerResult.result) { 
            statusMsg(`success`, `Created stream marker (ID: ${markerResult.id}) at ${markerResult.position_seconds} seconds`);
            // updateRecentEvents(`You created a stream marker`);
            updateRecentEvents('you', 'you', `You created a stream marker`);
        }
        else {
            statusMsg(`error`, `Error creating stream marker: ${markerResult.message}`);
            if((markerResult.message).search(`Missing scope`) !== -1) { 
                statusMsg(`error`, `Missing scope for command. Please create a new token by clicking Get Token in the settings page. DO NOT DO THIS WHILE LIVE!`);
            }            
            // updateRecentEvents(`Error creating stream marker. Check status box below for details`);
            updateRecentEvents('system', 'system', `Error creating stream marker. Check status box below for details`);
        }
    }
});

ipcMain.handle('newSoundsSettings', async (event, args) => {
    // old
    // let newChannelPointsSounds = {};
    // for(let key in args[0]) {
    //     newChannelPointsSounds[args[0][key].name] = args[0][key].filename;
    // }
    // // await setChannelPointsSounds(soundsSettingsFilePath, newChannelPointsSounds);
    // // await loadChannelPointsSounds(); // load channel points sounds     
    // // if(soundsDir.length > 1) {
    // //     randomSounds = []; // clear random sounds array
    // //     randomSounds = await loadSounds(soundsDir, channelPointsFilenames); // rebuild random sounds array
    // // }
    let newChannelPointsSounds = {};
    for(let key in args) {
        newChannelPointsSounds[args[key].name] = args[key].filename;
    }
    await setChannelPointsSounds(soundsSettingsFilePath, newChannelPointsSounds);
    await loadChannelPointsSounds(); // load channel points sounds     
    if(soundsDir.length > 1) {
        randomSounds = []; // clear random sounds array
        randomSounds = await loadSounds(soundsDir, channelPointsFilenames); // rebuild random sounds array
    }    
});

ipcMain.handle('botSettingsFromForm', async (event, args) => {
    // TO DO - change names to match and run this through a loop - skip any blank values
    if(args.botUsername.length > 1 && args.botUsername !== undefined) {
        // await updateBotSettings('username', args.botUsername);
        await setBotSettings(botSettingsFilePath,'username', args.botUsername);
    }
    if(args.botToken.length > 1 && args.botToken !== undefined) {
        // await updateBotSettings('token', args.botToken);
        await setBotSettings(botSettingsFilePath,'token', args.botToken);
    }
    if(args.clientId.length > 1 && args.clientId !== undefined) {        
        // await updateBotSettings('clientId', args.clientId);
        await setBotSettings(botSettingsFilePath,'clientId', args.clientId);
    }
    if(args.channel.length > 1 && args.channel !== undefined) {        
        // await updateBotSettings('channel', args.channel);
        await setBotSettings(botSettingsFilePath,'channel', args.channel);
    }
    if(args.beatSpreadSheetUrl !== undefined && args.beatSpreadSheetUrl.length > 1) {  
        try {
            let beatSheetInfo = getSpreadsheetInfo(args.beatSpreadSheetUrl);
            // await updateBotSettings('beatSheetID', beatSheetInfo.worksheetId);
            // await updateBotSettings('beatSpreadSheetID', beatSheetInfo.spreadsheetId);
            await setBotSettings(botSettingsFilePath,'beatSpreadSheetID', beatSheetInfo.spreadsheetId);
        }
        catch(error) {
            console.log(error);
        }
    }
    if(args.beatGameSound.length > 1) {
        // await updateBotSettings('beatGameSound', args.beatGameSound);
        await setBotSettings(botSettingsFilePath,'beatGameSound', args.beatGameSound);
    }
    let updateMsg = `Settings updated. You will need to restart if your token was added or changed.`;
    statusMsg(`success`, updateMsg);
    // updateRecentEvents(updateMsg);
    updateRecentEvents('system', 'system', updateMsg);
    win.webContents.executeJavaScript(`alertMsg('true','success', '${updateMsg}')`);
    saveWindowPosition();
    return true;
});

ipcMain.handle('loadSounds', async (event, args) => {
    await loadChannelPointsSounds();
    if(soundsDir.length > 1) {
        randomSounds = await loadSounds(soundsDir, channelPointsFilenames);
    }    
    let returnSounds = [...randomSounds, ...channelPointsFilenames];
    return returnSounds;
});

ipcMain.handle('getCurrentCommands', async (event, args) => {
    await loadCommands();
    return commands;
});

ipcMain.handle('getAbout', async (event, args) => {
    checkGoogleCreds();
    let aboutInfo = {
        versionNumber: versionNumber,
        randomSoundsCount: randomSounds.length,
        channelPointsSoundsCount: channelPointsFilenames.length,
        googleCredsExist: googleCredsExist
    }
    return aboutInfo;
});

ipcMain.handle('updateCmdSettings', async (event, args) => {
    let newCmdSettings = args;
    for(key in newCmdSettings) {
        await setBotSettings(botSettingsFilePath, newCmdSettings[key].name, newCmdSettings[key].enabled);        
    }
});

ipcMain.handle('getCurrentSettings', async (event, args) => {
    let currentSettings = await getBotSettings(botSettingsFilePath);
    if(currentSettings.successful) {
        currentSettings['soundsDir'] = soundsDir;
        currentSettings['configsDir'] = configsDir
        return currentSettings;
    }
    else {
        return undefined;
    }
});

ipcMain.handle('getSoundsSettings', async (event, args) => {

    await loadChannelPointsSounds();
    let randSounds = [];
    if(soundsDir.length > 1) {
         randSounds = await loadSounds(soundsDir, channelPointsFilenames);
    }
    // console.log(channelPointsFilenames);
    let returnSounds = {
        random: randomSounds,
        rewards: channelPointsSounds
    }
    return returnSounds; 
});

ipcMain.handle('playRandomSound', (event) => {
    let soundName = playRandomSound();
    // updateRecentEvents(`You played random sound ${soundName}`);
    updateRecentEvents('you','you',`You played random sound ${soundName}`);
});

ipcMain.handle('loadGoogleCredsFile', async () => {
    let openOptions = {
        title: "Open Google Creds File",
        buttonLabel: "Open",
        filters: [{name: "JSON", extensions: ['json']}]
    };
    let selectedFile = dialog.showOpenDialogSync(win, openOptions);
    if(selectedFile !== undefined) {
        try {
            fs.copyFileSync(selectedFile[0], googleCredsFilePath);
            statusMsg('success', 'Google creds file saved.');
            checkGoogleCreds();        
            win.webContents.executeJavaScript(`loadedGoogleCredsFile(true)`);            
        }
        catch(error) {
            statusMsg('error', `Error saving google creds file: ${error}`);
            checkGoogleCreds();        
            win.webContents.executeJavaScript(`loadedGoogleCredsFile(false)`);            
        }
    }
    else {
        statusMsg('error', `Error saving google creds file: No file selected`);
        checkGoogleCreds();
        win.webContents.executeJavaScript(`loadedGoogleCredsFile(false)`);
    }
});

function statusMsg(msgType, msg) { 
    let sendMsg = {
        type: msgType,
        message: msg
    }
    win.webContents.send('status', sendMsg);
    console.log(msg);
}

// function updateRecentEvents(msg) {
//     win.webContents.send('updateRecentEvents', msg);
// }

function updateRecentEvents(image, user, msg) {
    let eventInfo = {
        image: image,
        user: user,
        msg: msg
    };
    win.webContents.send('updateRecentEvents', eventInfo);
}

// electron end

// pubsub start

function playRandomSound() { 
    let randomIndex = Math.floor(Math.random() * Math.floor(randomSounds.length));
    let randomSound = randomSounds[randomIndex];
    win.webContents.executeJavaScript(`playSound('${randomSound}')`);
    statusMsg(`info`, `Playing sound ${randomSound}`); 
    return randomSound;
}

async function proecssReward(reward) {
    statusMsg(`reward`, 'Reward ' + reward.data.redemption.reward.title + ' was redeemed by ' + reward.data.redemption.user.display_name + ' for ' + reward.data.redemption.reward.cost + ' points');
    // console.log(reward.data.redemption);
    // console.log(`Redemption ID: ${reward.data.redemption.id}`);
    // console.log(`Reward ID: ${reward.data.redemption.reward.id}`);
    // console.log(`Channel ID: ${reward.data.redemption.reward.channel_id}`);        
    let redemptionId = reward.data.redemption.id;  
    let rewardId = reward.data.redemption.reward.id;
    let rewardChannelId = reward.data.redemption.reward.channel_id;

    if(reward.data.redemption.reward.title.toLowerCase() == 'random sound') {
        // add a while loop to re-roll random if it picks the same sound twice or the beat game sound
        let soundName = playRandomSound();
        let userInfo = await twitchAPI.getTwitchUserInfo(reward.data.redemption.user.id, botSettings.clientId, botSettings.token);
        let userImg = userInfo[0].profile_image_url;
        // updateChannelPointRedemption(redemptionId, rewardChannelId, rewardId, botSettings.clientId, botSettings.token, 'FULFILLED'); // maybe one day, the client ID used by the bot has to create the reward for this to work 
        updateRecentEvents(`${userImg}`,`${reward.data.redemption.user.display_name}`,`played random sound ${soundName}`);
        // updateRecentEvents(`${reward.data.redemption.user.display_name} played random sound ${soundName}`);
    }
    else {
        for(let x in channelPointsSounds) {
            if(channelPointsSounds[x].name.toLowerCase() == reward.data.redemption.reward.title.toLowerCase()) {
                win.webContents.executeJavaScript(`playSound('${channelPointsSounds[x].filename}')`);
                statusMsg(`info`, `Playing sound ${channelPointsSounds[x].name} (${channelPointsSounds[x].filename})`);
                let userInfo = await twitchAPI.getTwitchUserInfo(reward.data.redemption.user.id, botSettings.clientId, botSettings.token);
                let userImg = userInfo[0].profile_image_url;     
                // updateChannelPointRedemption(redemptionId, rewardChannelId, rewardId, botSettings.clientId, botSettings.token, 'FULFILLED');                           
                updateRecentEvents(`${userImg}`,`${reward.data.redemption.user.display_name}`, `played sound ${channelPointsSounds[x].filename}`);
                // updateRecentEvents(`${reward.data.redemption.user.display_name} played sound ${channelPointsSounds[x].filename}`);
                break;
            }   
        }
    }
}

async function pubsubHandle(msg) {
    if(msg.type == 'MESSAGE') {
        pubsubMessage = JSON.parse(msg.data.message);
        if(pubsubMessage.type == 'reward-redeemed') {
            proecssReward(pubsubMessage);
        }
    }
}

function pubsubPings() {
    pubsubSocket.send(JSON.stringify({type:"PING"}));
    saveWindowPosition(); // save window position, nothing specific to pubsub just using the timer here.
    setTimeout(pubsubPings,120000); // 2 minutes
}

function saveWindowPosition() {
    setBotSettings(windowSettingsFilePath, 'window', win.getBounds());
}


// pubsubSocket.onopen = async function(e) {
//     await botSettingsDB.sync();
//     let botset = await botSettingsDB.findOrCreate({where: {id: 1}}); 
//     botSettings = botset[0];  
//     // TO DO - move bot settings to a command or load it all before starting these 
//     if(botSettings !== undefined) {
//         let channelId = await twitchAPI.getChannelID(botSettings.channel, botSettings.clientId, botSettings.token);
//         let connectMsg =  {
//             type: "LISTEN",
//             nonce: "44h1k13746815ab1r2",
//             data:  {
//             topics: ["channel-points-channel-v1." + channelId],
//             auth_token: botSettings.token
//             }
//         };
//         pubsubSocket.send(JSON.stringify(connectMsg));
//         console.log(`Pubsub connected. Listed topics: ${connectMsg.data.topics}`);
//         pubsubPings();
//     }
// };

pubsubSocket.onmessage = function(event)  {
    pubsubResonse = JSON.parse(event.data);
    pubsubHandle(pubsubResonse);
};

// pubsub end

app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-available', () => {
    statusMsg(`info`, `Update available. Starting download.`);
    updateRecentEvents(`system`,`system`, `Update available. Starting download.`);
});

autoUpdater.on('update-downloaded', () => {
    // updateRecentEvents(`Update downloaded. Update will be installed next time the bot is closed.`);
    statusMsg(`info`, `Update downloaded. Update will be installed next time the bot is closed.`);
    updateRecentEvents(`system`,`system`,`Update downloaded. Update will be installed next time the bot is closed.`);
});

startBot();

