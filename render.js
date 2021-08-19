const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const { shell } = require('electron');

ipc.on('status', (event, msg) => {
    updateStatus(msg.type, msg.message);
});

ipc.on('updateRecentEvents', (event, msg) => {
    updateRecentEvents(msg);
});

function loadedGoogleCredsFile(savedResult) {
    if(savedResult) {
        alertMsg(true, 'success', 'Google creds file saved.')        
        let googleCredsUploadButton = document.getElementById('googleCredsUploadButton'); 
        googleCredsUploadButton.innerHTML = `Google Creds File Saved &#10003;`
        googleCredsUploadButton.classList.add('btn-success');
        googleCredsUploadButton.classList.add('btn-secondary');
    }
    else {
        alertMsg(true, 'error', 'Error saving Google creds file. See status box for details.')
        let googleCredsUploadButton = document.getElementById('googleCredsUploadButton'); 
        googleCredsUploadButton.innerHTML = `Error saving file &#10007;`
        googleCredsUploadButton.classList.add('btn-danger');
        googleCredsUploadButton.classList.add('btn-secondary');
    }
}

function openGoogleCredsFile() {
    ipc.invoke('loadGoogleCredsFile');
}

function updateRecentEvents(msg) {
    let recentList = document.getElementById('recentList');
    // recentList.innerHTML = `<li class="list-group-item text-muted">${msg}</li> ${recentList.innerHTML}`;
    recentList.innerHTML = `<li class="list-group-item"><small>${msg}</small></li>${recentList.innerHTML}`;
}

function updateStatus(msgType, msg) {
    let msgColor = `text-white-75`;
    if(msgType == 'error') {        
        msgColor = `text-danger`;
    }
    else if(msgType == 'warning') {
        msgColor = `text-warning`;
    }
    else if(msgType == 'success') {
        msgColor = `text-success`;
    }
    else if(msgType == 'info') {
        msgColor = `text-white`;
    }    
    else if(msgType == 'special') {
        msgColor = `text-info`;
    }
    else if(msgType == 'reward') {
        msgColor = `text-info`;
    }
    else {
        msgColor = `text-white`;
    }
    let statusBox = document.getElementById('statusBox')
    statusBox.innerHTML += `<span class="${msgColor}">${msg}</span><br>`;
    statusBox.scrollTop = statusBox.scrollHeight;
}

function minimizeWindow() {
    remote.getCurrentWindow().minimize();
}

async function loadSettings() {
    let result = ipc.sendSync('getSettings');
    return result;
}

function runAd() {
    ipc.invoke('runAd');
}

function createStreamMarker() {
    ipc.invoke('createStreamMarker');
}

function brb() {
    createStreamMarker();
    runAd();
}

function setConnectionStatus(service, status, message) {
    let newStatusIcon = ``;
    let newStatusMessage = ``;
    let connectedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 20 20"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>`;
    let warningIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" class="bi bi-exclamation-circle-fill" viewBox="0 0 20 20"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>`;
    let errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 20 20"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg>`;
    let questionIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" class="bi bi-question-circle-fill" viewBox="0 0 20 20"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/></svg>`;
    
    switch(status) {
        case 'connected':
            newStatusIcon = connectedIcon;
            newStatusMessage = "connected";
            break;
        case 'warning':
            newStatusIcon = warningIcon;
            newStatusMessage = `warning: ${message}`;
            break;            
        case 'error':
            newStatusIcon = errorIcon;
            newStatusMessage = `error: ${message}`;
            break;            
        case 'question':
            newStatusIcon = questionIcon;
            break;            
        default: 
            newStatusIcon = questionIcon;
    }

    if(service == 'chatBot') { 
        document.getElementById('chatBotStatusIcon').innerHTML = newStatusIcon;
        document.getElementById('aboutChatBotStatus').innerHTML = `Chat bot status: ${newStatusMessage}`;
    }
    
    if(service == 'pubsub') { 
        document.getElementById('pubsubStatusIcon').innerHTML = newStatusIcon;
        document.getElementById('aboutPubsubStatus').innerHTML = `Pubsub status: ${newStatusMessage}`;
    }

}

async function updateSoundsList() { 
    let sounds = await ipc.invoke('loadSounds');
    let soundsHTML = ` `;
    let randomColorMode = false;
    let buttonColors = ['btn-primary', 'btn-secondary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info', 'btn-light'];
    if(sounds.length > 0){
        for(let s = 0; s < sounds.length; s++) {  
            let soundName = sounds[s].replace('.mp3','');
            if(randomColorMode) {
                let buttonColor = Math.floor(Math.random() * ((buttonColors.length - 1) - 0 + 1) + 0);            
                soundsHTML += `<button type="button" class="btn ${buttonColors[buttonColor]} m-1" onclick="playSound('${sounds[s]}')">${soundName}</button>`; // lol
                
            }
            else {
                soundsHTML += `<button type="button" class="btn btn-secondary m-1" onclick="playSound('${sounds[s]}')">${soundName}</button>`;
            }
        }
    }
    // if(sounds.length > 0){
    //     let buttonRowCount = 0;
    //     let buttonRows = 1;
    //     soundsHTML += `<table class="mx-auto">`;
    //     for(let s = 0; s < sounds.length; s++) {
    //         if(buttonRowCount == 3) {
    //             buttonRows++;
    //             buttonRowCount = 0;
    //             soundsHTML += `</tr><tr>`;
    //         }
    //         let soundName = sounds[s].replace('.mp3','');
    //         soundsHTML += `<td><button type="button" class="btn btn-secondary" style="height: 100%; width: 100%;" onclick="playSound('${sounds[s]}')">${soundName}</button></td>`;
    //         buttonRowCount++;
    //     }
    // }
    // soundsHTML += `</tr></table>`;
    document.getElementById('soundboard').innerHTML = soundsHTML;
}

function playRandomSound() {
    ipc.invoke('playRandomSound');
}

async function playSound(sound) {
    let result = await ipc.invoke('getCurrentSettings');
    if(result !== undefined) {
        let audio = new Audio(`${result.soundsDir}\\${sound}`);
        try { audio.play(); }
        catch(err) { console.log(err); }
    }    
}

function checkWin() {
    ipc.send('checkWin');
}

async function externalLink(destination) {
    let result = await ipc.invoke('getCurrentSettings');   
    if(destination == 'token') {
        shell.openExternal(`https://id.twitch.tv/oauth2/authorize?client_id=rq2a841j8f63fndu5lnbwzwmbzamoy&redirect_uri=https://acceptdefaults.com/twitch-oauth-token-generator/&response_type=token&scope=bits:read+channel:read:redemptions+channel:moderate+chat:edit+chat:read+user:edit:broadcast+channel:edit:commercial`);
    }
    else if(destination == 'manageRewards') {
        shell.openExternal(`https://dashboard.twitch.tv/u/${result.username.toLowerCase()}/community/channel-points/rewards`);
    }
    else if(destination == 'wiki') {
        shell.openExternal(`https://github.com/VariXx/varibot-twitch-js/wiki`);
    }
    else if(destination == 'discord') {
        shell.openExternal(`https://discord.gg/QNppY7T`);
    }
    else if(destination == 'botSettingsHelp') {
        shell.openExternal(`https://github.com/VariXx/varibot-twitch-js/wiki/Settings#general-settings`);
    }
    else if(destination == 'googleSheetsHelp') {
        shell.openExternal(`https://github.com/VariXx/varibot-twitch-js/wiki/Settings#google-spreadsheets-settings`);
    }
}

// async function openTokenPage() { 
//     let result = await ipc.invoke('getCurrentSettings');
//     shell.openExternal(`https://id.twitch.tv/oauth2/authorize?client_id=rq2a841j8f63fndu5lnbwzwmbzamoy&redirect_uri=https://acceptdefaults.com/twitch-oauth-token-generator/&response_type=token&scope=bits:read+channel:read:redemptions+channel:moderate+chat:edit+chat:read+user:edit:broadcast`);
// }

// async function openChannelRewardsPage() {
//     let result = await ipc.invoke('getCurrentSettings');
//     shell.openExternal(`https://dashboard.twitch.tv/u/${result.username}/community/channel-points/rewards`);
// }

async function openSoundsDir() {
    let result = await ipc.invoke('getCurrentSettings');
    if(result !== undefined) {
        shell.openPath(`${result.soundsDir}`);
    }
}

function updateElement() { 

}

function changeActiveTab(activeTab) { 
    // let navbar = document.getElementById('navBar-left');
    // let navList = navbar.getElementsByTagName('li');
    // for(let x = 0; x < navList.length; x++) {
    //     if(navList[x].classList.contains('active')) {
    //         navList[x].classList.remove('active');
    //     }
    // }
    // let newActive = document.getElementById(`${activeTab}Nav`);
    // newActive.classList.add('active');
    console.log(`Changed to ${activeTab}`);
}

async function populateSettings(settingsPage) {

    // TO DO - settings and sounds load but they're the old versions 

    if(settingsPage == 'home') { 
        // no settings 
    }
    if(settingsPage == 'settings') {
        // old settings page
    //     let settingsPageHTML = `<div class="card my-4">
    //     <div class="card-header">General Settings</div>              
    //     <div class="card-body">
    //         <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    //         <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
    //       </svg></h4>
    //       <form id="settingsForm">
    //         <div class="form-group">
    //           <label for="botUsername">Username</label>
    //           <input type="text" class="form-control" id="botUsername" placeholder="Enter username">
    //           <small id="botUsernameHelp" class="form-text text-muted">Username used by the bot</small>
    //         </div>
    //         <div class="form-group">
    //           <label for="botToken">Token</label>
    //           <input type="password" class="form-control" id="botToken" placeholder="Enter token">
    //           <small id="botTokenHelp" class="form-text text-muted">Token (not password) used for the bot. See below for link to get token.</small>
    //         </div>
    //         <div class="form-group">
    //           <label for="clientId">Client ID</label>
    //           <input type="text" class="form-control" id="clientId" placeholder="Enter client ID" value="rq2a841j8f63fndu5lnbwzwmbzamoy">
    //           <small id="clientIdHelp" class="form-text text-muted">Client ID for the bot. If you don't know what this is you can leave it as default. (Default: rq2a841j8f63fndu5lnbwzwmbzamoy)</small>
    //         </div>              
    //         <div class="form-group">
    //           <label for="channel">Channel</label>
    //           <input type="text" class="form-control" id="channel" placeholder="Enter channel">
    //           <small id="channelHelp" class="form-text text-muted">Channel for the bot to join. Do not include #. (ex: varixx)</small>
    //         </div>      
    //     </div>  
    //   </div>
    //   <div class="card my-4">
    //     <div class="card-header">Google Spreadsheets Settings</div>              
    //     <div class="card-body">
    //         <!-- <h4 class="card-title">Google Spreadsheets Settings <svg width=".75em" height=".75em" viewBox="0 0 16 16" class="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onclick="externalLink('googleSheetsHelp')"> -->
    //           <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    //           <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
    //         </svg></h4>
    //         <div class="form-group">
    //           <label for="beatSpreadSheetUrl">Completed games spreadsheet URL</label>
    //           <input type="text" class="form-control" id="beatSpreadSheetUrl" placeholder="https://docs.google.com/spreadsheets/d/<spreadsheet-id>/edit#gid=<worksheet-id>">
    //           <small id="beatSpreadSheetUrlHelp" class="form-text text-muted">Full URL of completed games spreadsheet in Google Drive.</small>              
    //         </div>              
    //         <div class="form-group">
    //           <label for="beatGameSound">Beat game sound</label>
    //           <input type="text" class="form-control" id="beatGameSound" placeholder="Enter filename">
    //           <small id="beatGameSoundHelp" class="form-text text-muted">Sound played after adding game to completed games spreadsheet. This must be in the sounds directory listed above. Filename (including .mp3) only.</small>
    //         </div>     
    //         </form><button class="btn btn-primary btn-sm" onclick="saveSettingsFromForm()">Save</button><button class="btn btn-danger btn-sm ml-2" onclick="externalLink('token')">Get Token</button><button class="btn btn-secondary btn-sm ml-2" id="googleCredsUploadButton" onclick="loadGoogleCredsFile()">Save Google Creds File</button>
    //     </div>  
    //   </div>`;
    //     document.getElementById('settings').innerHTML = settingsPageHTML;      
    //     let result = await ipc.invoke('getCurrentSettings');
    //     if(result !== undefined) {
    //         if(result.username !== undefined) {
    //             document.getElementById('botUsername').value = result.username;
    //         }
    //         if(result.token !== undefined) {
    //             document.getElementById('botToken').value = result.token;
    //         }
    //         if(result.clientId !== undefined) {
    //             document.getElementById('clientId').value = result.clientId;
    //         }
    //         if(result.channel !== undefined) {
    //             document.getElementById('channel').value = result.channel;
    //         }
    //         if(result.beatSpreadSheetID !== undefined && result.beatSpreadSheetID.length ) {
    //             let spreadSheetUrl = `https://docs.google.com/spreadsheets/d/${result.beatSpreadSheetID}`;
    //             document.getElementById('beatSpreadSheetUrl').value = spreadSheetUrl; 
    //         }
    //         if(result.beatGameSound !== undefined) {
    //             document.getElementById('beatGameSound').value = result.beatGameSound;
    //         }
    //     }

        // new settings page
        let result = await ipc.invoke('getCurrentSettings');
        if(result !== undefined) {
            if(result.username !== undefined) {
                document.getElementById('botUsername').value = result.username;
            }
            if(result.token !== undefined) {
                document.getElementById('botToken').value = result.token;
            }
            if(result.clientId !== undefined) {
                document.getElementById('clientId').value = result.clientId;
            }
            if(result.channel !== undefined) {
                document.getElementById('channel').value = result.channel;
            }
            if(result.beatSpreadSheetID !== undefined && result.beatSpreadSheetID.length ) {
                let spreadSheetUrl = `https://docs.google.com/spreadsheets/d/${result.beatSpreadSheetID}`;
                document.getElementById('beatSpreadSheetUrl').value = spreadSheetUrl; 
            }
            if(result.beatGameSound !== undefined) {
                document.getElementById('beatGameSound').value = result.beatGameSound;
            }
        }        

        // old commands page
        // let result = await ipc.invoke('getCurrentCommands');
        // let cmdPageHTML = `<div class="card"><div class="card-header">Commands</div>`;
        // if(result !== undefined) {
        //     cmdPageHTML += `<div class="card-body" id="cmdsBody">`;            
        //     if(Object.keys(result)) {                
        //         cmdPageHTML += `<form id="cmdForm"><table class="table table-hover" style="table-layout:auto;"><tbody>`;
        //         for(let cmd in result) { 
        //             cmdPageHTML += `<tr id="${result[cmd].name}"><td style="width: 5px; text-align: center;">`;
        //             if(result[cmd].enabled) {
        //                 cmdPageHTML += `<input type="checkbox" checked id="cmdStatus">`;
        //             }
        //             else {
        //                 cmdPageHTML += `<input type="checkbox" id="cmdStatus">`;
        //             }
        //             cmdPageHTML += `</td><td id="cmdName">${result[cmd].name}</td></tr>`;
        //         }
        //         cmdPageHTML += `</tbody></table></form><button type="submit" class="btn btn-primary btn-sm mt-2" onclick="saveCmdForm()">Save</button>`;
                
        //     }
        //     cmdPageHTML += `</div>`;
        // }
        // document.getElementById('cmds').innerHTML = cmdPageHTML;

        // new commands page
        let cmdsResult = await ipc.invoke('getCurrentCommands');
        let newCmdSettingsList = ``;
        if(cmdsResult !== undefined) {
            if(Object.keys(cmdsResult)) {                
                for(let cmd in cmdsResult) { 
                    if(cmdsResult[cmd].enabled) {                    
                        newCmdSettingsList += `<li class="my-1"><input class="mx-2" type="checkbox" name="cmdSettingCheckbox" id="${cmdsResult[cmd].name}" checked>${cmdsResult[cmd].name}</li>`;
                    }
                    else {
                        newCmdSettingsList += `<li class="my-1"><input class="mx-2" type="checkbox" name="cmdSettingCheckbox" id="${cmdsResult[cmd].name}">${cmdsResult[cmd].name}</li>`;
                    }
                }
            }
        }
        document.getElementById('commandsSettingsList').innerHTML = newCmdSettingsList;
    }
    if(settingsPage == 'channelPoints') {
        // old sounds page
        // await ipc.invoke('loadSounds');        
        // let result = await ipc.invoke('getSoundsSettings');
        // // console.log(`render result: ${result}`);
        // let soundsPageHTML = `<div class="card"><div class="card-header">Sounds</div><div class="card-body">`;
        // if(result !== undefined) {
        //     soundsPageHTML += `<button type="submit" class="btn btn-primary btn-sm mr-2 mb-4" onclick="saveSoundsForm()">Save</button><button class="btn btn-primary btn-sm mr-2 mb-4" onclick="openSoundsDir()"><svg class="bi bi-folder-symlink" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        //     <path d="M9.828 4a3 3 0 0 1-2.12-.879l-.83-.828A1 1 0 0 0 6.173 2H2.5a1 1 0 0 0-1 .981L1.546 4h-1L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3v1z"/>
        //     <path fill-rule="evenodd" d="M13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zM2.19 3A2 2 0 0 0 .198 5.181l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H2.19z"/>
        //     <path d="M8.616 10.24l3.182-1.969a.443.443 0 0 0 0-.742l-3.182-1.97c-.27-.166-.616.036-.616.372V6.7c-.857 0-3.429 0-4 4.8 1.429-2.7 4-2.4 4-2.4v.769c0 .336.346.538.616.371z"/>
        //   </svg> Open sounds folder</button><button class="btn btn-primary btn-sm mr-2 mb-4" onclick="externalLink('manageRewards')"> Manage Channel Rewards</button><form id="soundsForm"><table class="table table-hover"><thead><tr><th scope="col">Filename</th><th scope="col">Reward Name (leave unchecked for random)</th></tr></thead><tbody>`;
        //     let randomSounds = result.random; 
        //     if(Object.keys(result.rewards).length > 0) {
        //     // if(result.rewards !== undefined) {
        //         for(let sound in result.rewards) { 
        //             soundsPageHTML += `<tr id="${result.rewards[sound].filename}"><td id="filename"><svg onclick="playSound('${result.rewards[sound].filename}')" width="20px" height="20px" viewBox="0 0 16 16" class="bi bi-play mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        //             <path fill-rule="evenodd" d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
        //           </svg>${result.rewards[sound].filename}</td><td><div class="input-group">
        //             <div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" checked>
        //             </div></div>
        //             <input type="text" class="form-control" value="${result.rewards[sound].name}"></div></td></tr>`;                    
        //         }
        //     }               
        //     if(randomSounds.length > 0) {
        //         for(let s = 0; s < randomSounds.length; s++) {
        //             soundsPageHTML += `<tr id="${randomSounds[s]}"><td id="filename"><svg onclick="playSound('${randomSounds[s]}')" width="20px" height="20px" viewBox="0 0 16 16" class="bi bi-play mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        //             <path fill-rule="evenodd" d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
        //           </svg>${randomSounds[s]}</td><td><div class="input-group">
        //             <div class="input-group-prepend"><div class="input-group-text"><input type="checkbox">
        //             </div></div>
        //             <input type="text" class="form-control"></div></td></tr>`;
        //         }
        //     }
        //     soundsPageHTML += `</tbody></table></form><button type="submit" class="btn btn-primary btn-sm" onclick="saveSoundsForm()">Save</button>`;
        // }
        // soundsPageHTML += `</div></div>`;
        // document.getElementById('sounds').innerHTML = soundsPageHTML;


        await ipc.invoke('loadSounds');        
        let soundsList = await ipc.invoke('getSoundsSettings');
        let channelRewards = await ipc.invoke('getChannelRewards');
        let channelRewardsTable = document.getElementById('channelRewardsTable');
        let channelRewardsTableHTML = ``;
        if(channelRewards !== undefined && channelRewards.length > 0) {
            for(let reward = 0; reward < channelRewards.length; reward++) {
                if(channelRewards[reward].title.toLowerCase() == 'random sound') {
                    continue;
                }
                let rewardImage = channelRewards[reward].default_image.url_1x
                if(channelRewards[reward].image !== null){
                    rewardImage = channelRewards[reward].image.url_1x;
                }
                channelRewardsTableHTML += `<tr id="${channelRewards[reward].title}"><td><img src="${rewardImage}"></td><td name="channelRewardName">${channelRewards[reward].title}</td></li></ul></td><td><select class="custom-select custom-select-sm w-100" id="${channelRewards[reward].title}" name="channelRewardSound">`;
                let foundRewardSound = false; 
                for(let s in soundsList.rewards) {
                    if(channelRewards[reward].title.toLowerCase() == soundsList.rewards[s].name.toLowerCase()) {
                        channelRewardsTableHTML += `<option value="${soundsList.rewards[s].filename}" selected>`;
                        foundRewardSound = true;
                    }
                    else{
                        channelRewardsTableHTML += `<option value="${soundsList.rewards[s].filename}">`;
                    }   
                    channelRewardsTableHTML += `${soundsList.rewards[s].filename}</option>`;
                }
                for(let snd = 0; snd < soundsList.random.length; snd++) {
                    channelRewardsTableHTML += `<option value="${soundsList.random[snd]}">${soundsList.random[snd]}</option>`;
                }
                if(foundRewardSound) {
                    channelRewardsTableHTML += `<option value="none">none</option></td></tr>`;
                }
                else {
                    channelRewardsTableHTML += `<option value="none" selected>none</option></td></tr>`;
                }
            }
        }

        channelRewardsTable.innerHTML = channelRewardsTableHTML;
        // // console.log(`render result: ${result}`);
        // let soundsPageHTML = `<div class="card"><div class="card-header">Sounds</div><div class="card-body">`;
        // if(result !== undefined) {
        //     soundsPageHTML += `<button type="submit" class="btn btn-primary btn-sm mr-2 mb-4" onclick="saveSoundsForm()">Save</button><button class="btn btn-primary btn-sm mr-2 mb-4" onclick="openSoundsDir()"><svg class="bi bi-folder-symlink" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        //     <path d="M9.828 4a3 3 0 0 1-2.12-.879l-.83-.828A1 1 0 0 0 6.173 2H2.5a1 1 0 0 0-1 .981L1.546 4h-1L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3v1z"/>
        //     <path fill-rule="evenodd" d="M13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zM2.19 3A2 2 0 0 0 .198 5.181l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H2.19z"/>
        //     <path d="M8.616 10.24l3.182-1.969a.443.443 0 0 0 0-.742l-3.182-1.97c-.27-.166-.616.036-.616.372V6.7c-.857 0-3.429 0-4 4.8 1.429-2.7 4-2.4 4-2.4v.769c0 .336.346.538.616.371z"/>
        //   </svg> Open sounds folder</button><button class="btn btn-primary btn-sm mr-2 mb-4" onclick="externalLink('manageRewards')"> Manage Channel Rewards</button><form id="soundsForm"><table class="table table-hover"><thead><tr><th scope="col">Filename</th><th scope="col">Reward Name (leave unchecked for random)</th></tr></thead><tbody>`;
        //     let randomSounds = result.random; 
        //     if(Object.keys(result.rewards).length > 0) {
        //     // if(result.rewards !== undefined) {
        //         for(let sound in result.rewards) { 
        //             soundsPageHTML += `<tr id="${result.rewards[sound].filename}"><td id="filename"><svg onclick="playSound('${result.rewards[sound].filename}')" width="20px" height="20px" viewBox="0 0 16 16" class="bi bi-play mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        //             <path fill-rule="evenodd" d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
        //           </svg>${result.rewards[sound].filename}</td><td><div class="input-group">
        //             <div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" checked>
        //             </div></div>
        //             <input type="text" class="form-control" value="${result.rewards[sound].name}"></div></td></tr>`;                    
        //         }
        //     }               
        //     if(randomSounds.length > 0) {
        //         for(let s = 0; s < randomSounds.length; s++) {
        //             soundsPageHTML += `<tr id="${randomSounds[s]}"><td id="filename"><svg onclick="playSound('${randomSounds[s]}')" width="20px" height="20px" viewBox="0 0 16 16" class="bi bi-play mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        //             <path fill-rule="evenodd" d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
        //           </svg>${randomSounds[s]}</td><td><div class="input-group">
        //             <div class="input-group-prepend"><div class="input-group-text"><input type="checkbox">
        //             </div></div>
        //             <input type="text" class="form-control"></div></td></tr>`;
        //         }
        //     }
        //     soundsPageHTML += `</tbody></table></form><button type="submit" class="btn btn-primary btn-sm" onclick="saveSoundsForm()">Save</button>`;
        // }
        // soundsPageHTML += `</div></div>`;
        // document.getElementById('sounds').innerHTML = soundsPageHTML;
    }
    // if(settingsPage.toLowerCase() == 'cmds') {
    //     let result = await ipc.invoke('getCurrentCommands');
    //     let cmdPageHTML = `<div class="card"><div class="card-header">Commands</div>`;
    //     if(result !== undefined) {
    //         cmdPageHTML += `<div class="card-body" id="cmdsBody">`;            
    //         if(Object.keys(result)) {                
    //             cmdPageHTML += `<form id="cmdForm"><table class="table table-hover" style="table-layout:auto;"><tbody>`;
    //             for(let cmd in result) { 
    //                 cmdPageHTML += `<tr id="${result[cmd].name}"><td style="width: 5px; text-align: center;">`;
    //                 if(result[cmd].enabled) {
    //                     cmdPageHTML += `<input type="checkbox" checked id="cmdStatus">`;
    //                 }
    //                 else {
    //                     cmdPageHTML += `<input type="checkbox" id="cmdStatus">`;
    //                 }
    //                 cmdPageHTML += `</td><td id="cmdName">${result[cmd].name}</td></tr>`;
    //             }
    //             cmdPageHTML += `</tbody></table></form><button type="submit" class="btn btn-primary btn-sm mt-2" onclick="saveCmdForm()">Save</button>`;
                
    //         }
    //         cmdPageHTML += `</div>`;
    //     }
    //     document.getElementById('cmds').innerHTML = cmdPageHTML;
    // }
    if(settingsPage == 'about') {
        let result = await ipc.invoke('getAbout');
        document.getElementById('aboutBotVersion').innerHTML = `VariBot v${result.versionNumber}`;
        document.getElementById('aboutSoundsLoaded').innerHTML = `Random sounds loaded: ${result.randomSoundsCount}`;
        document.getElementById('aboutChannelRewardsLoaded').innerHTML = `Channel reward sounds loaded: ${result.channelPointsSoundsCount}`;
        document.getElementById('aboutGoogleCredsLoaded').innerHTML = `Google creds file loaded: ${result.googleCredsExist}`;
    }
}

// async function saveCmdForm() {
//     let cmdForm = document.getElementById('cmdForm');
//     let cmdTRs = cmdForm.getElementsByTagName('tr');
//     let cmdChanges = {};
//     for(let x = 0; x < cmdTRs.length; x++) { 
//         let cmdName = cmdTRs[x].getElementsByTagName('td')['cmdName'].innerText.trim();
//         let cmdStatus = cmdTRs[x].getElementsByTagName('input')['cmdStatus'].checked;
//         cmdChanges[cmdName] = {
//             name: cmdName,
//             enabled: cmdStatus
//         }
//     }
//     await ipc.invoke('updateCmdSettings', cmdChanges);
//     alertMsg(true, 'success', 'Commands updated');
//     showPage('cmds');
// }

function alertMsg(status, eventType, msg) {
    let alertBox = document.getElementById('alertBox');
    let alertBoxText = document.getElementById('alertBoxText');
    let alertMessage = '';
    alertBox.classList.remove('alert-primary');
    alertBox.classList.remove('alert-success');
    alertBox.classList.remove('alert-danger');
    alertBox.classList.remove('alert-warning');
    if(eventType == 'error') {
        
        alertBox.classList.add('alert-danger');
        alertMessage = 'Error: ';
    }
    else if(eventType == 'warning') {
        alertBox.classList.add('alert-warning');
        alertMessage = 'Warning: ';
    }
    else if(eventType == 'success') {
        alertBox.classList.add('alert-success');
    }
    else if(eventType == 'info') {
        alertBox.classList.add('alert-primary');
    }    
    else {
        alertBox.classList.add('alert-primary');
    }
    alertMessage += msg;    
    alertBoxText.innerText = alertMessage;    
    if(status) {
        alertBox.style.display = 'block';
    }
    else {
        alertBox.style.display = 'none';
    }
}

async function saveSoundsForm() {
    // old (yes, I'm finally cleaning up this hacky mess)
    // let soundsForm = document.getElementById('soundsForm');
    // let soundsTRs = soundsForm.getElementsByTagName('tr');
    // let newChannelPointsSounds = {};
    // let newRandomSounds = [];
    // for(let x = 1; x < soundsTRs.length; x++) { // skip 0, it's the header
    //     let filename = (soundsTRs[x].childNodes[0].innerText).trim();
    //     let rewardName = (soundsTRs[x].childNodes[1].childNodes[0].childNodes[3].value).trim();
    //     let rewardEnabled = soundsTRs[x].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].checked;
    //     if(rewardEnabled) {
    //         newChannelPointsSounds[rewardName] = {
    //             name: rewardName,
    //             filename: filename
    //         }
    //     }
    //     else {
    //         newRandomSounds.push(filename);
    //     }    
    // }
    // let newSoundsSettings = [newChannelPointsSounds, newRandomSounds];
    // await ipc.invoke('newSoundsSettings', newSoundsSettings);
    // alertMsg(true, 'success', 'Sounds updated');
    // showPage('sounds');


    // new
    let newChannelRewards = document.getElementsByName('channelRewardSound');
    let newChannelPointsSounds = {};
    let newRandomSounds = {};
    for(let cr = 0; cr < newChannelRewards.length; cr++) {
        // console.log(`Name: ${newChannelRewards[cr].id} Value: ${newChannelRewards[cr].value}`);
        if(newChannelRewards[cr].value != 'none') {
            newChannelPointsSounds[newChannelRewards[cr].id] = {
                name: newChannelRewards[cr].id,
                filename: newChannelRewards[cr].value
            }
        }
    }

    await ipc.invoke('newSoundsSettings', newChannelPointsSounds);
    alertMsg(true, 'success', 'Sounds updated');
    showPage('channelPoints');
}

async function showPage(page) {
    let pages = ['home','settings','channelPoints','about'];
    let showPage;
    for(let p = 0; p < pages.length; p++) { 
        if(pages[p] == page) {
            showPage = pages[p];
        }
        document.getElementById(pages[p]).style.display = 'none';
    }
    await populateSettings(showPage);
    // changeActiveTab(showPage);
    document.getElementById(showPage).style.display = 'block';
}

async function saveSettingsFromForm() {
    // old save settings   
    // let settingsForm = document.getElementById('settingsForm');
    // let botSettingsFromForm = {
    //     botUsername: botUsername.value,
    //     botToken: botToken.value,
    //     clientId: clientId.value,
    //     channel: channel.value,
    //     beatGameSound: beatGameSound.value
    // }
    // if(beatSpreadSheetUrl.value !== undefined && beatSpreadSheetUrl.value.length > 1) {
    //     let checkSpreadSheetUrl = beatSpreadSheetUrl.value.search(`https://docs.google.com/spreadsheets/d/`);
    //     if(checkSpreadSheetUrl !== -1) {
    //         botSettingsFromForm.beatSpreadSheetUrl = beatSpreadSheetUrl.value;
    //     }
    //     else {
    //         updateStatus('error', 'Invalid Google Spreadsheet URL');
    //     }
    // }    
    // let result = ipc.invoke('botSettingsFromForm', botSettingsFromForm);
    // showPage('home');

    // new settings page
    let botSettingsFromForm = {
        botUsername: document.getElementById('botUsername').value,
        botToken: document.getElementById('botToken').value,
        clientId: document.getElementById('clientId').value,
        channel: document.getElementById('channel').value,
        beatGameSound: document.getElementById('beatGameSound').value
    }
    // console.log(botSettingsFromForm);

    let cmdList = document.getElementsByName('cmdSettingCheckbox');
    let cmdChanges = {};    
    for(let c = 0; c < cmdList.length; c++) {
        let cmdName = cmdList[c].id.trim();
        let cmdStatus = cmdList[c].checked;
        // console.log(`${cmdList[c].id}: ${cmdList[c].checked}`);
        cmdChanges[cmdName] = {
            name: cmdName,
            enabled: cmdStatus
        }
    }
    await ipc.invoke('updateCmdSettings', cmdChanges);

    let beatSpreadSheetUrl = document.getElementById('beatSpreadSheetUrl');
    if(beatSpreadSheetUrl.value !== undefined && beatSpreadSheetUrl.value.length > 1) {
        let checkSpreadSheetUrl = beatSpreadSheetUrl.value.search(`https://docs.google.com/spreadsheets/d/`);
        if(checkSpreadSheetUrl !== -1) {
            botSettingsFromForm.beatSpreadSheetUrl = beatSpreadSheetUrl.value;
        }
        else {
            updateStatus('error', 'Invalid Google Spreadsheet URL');
        }
    }    
    
    let result = ipc.invoke('botSettingsFromForm', botSettingsFromForm);
    showPage('home');    
}

function closeBot() {
    const botWindow = remote.getCurrentWindow();
    botWindow.close();
}

// async function closeBot() {
//     alertMsg(true, 'info', 'Shutting down...');
//     await ipc.invoke('closeBot');
// }
