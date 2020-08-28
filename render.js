const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const { shell } = require('electron');

ipc.on('status', (event, msg) => {
    updateStatus(msg.type, msg.message);
});

function updateRecentEvents(msg) {
    let recentList = document.getElementById('recentList');
    recentList.innerHTML = `<li class="list-group-item"><small>${msg}</small></li> ${recentList.innerHTML}`;
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
        msgColor = `text-white-75`;
    }    
    else if(msgType == 'special') {
        msgColor = `text-info`;
    }
    else if(msgType == 'reward') {
        msgColor = `text-info`;
    }
    else {
        msgColor = `text-white-75`;
    }
    
    let statusBox = document.getElementById('status')
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

async function updateSoundsList() { 
    let sounds = await ipc.invoke('loadSounds');
    let soundsHTML = ` `;
//     `<button class="btn btn-primary btn-sm mr-1" onclick="updateSoundsList()"><svg class="bi bi-arrow-clockwise" width="1em" height="1em" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
//     <path fill-rule="evenodd" d="M3.17 6.706a5 5 0 0 1 7.103-3.16.5.5 0 1 0 .454-.892A6 6 0 1 0 13.455 5.5a.5.5 0 0 0-.91.417 5 5 0 1 1-9.375.789z"/>
//     <path fill-rule="evenodd" d="M8.147.146a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 1 1-.707-.708L10.293 3 8.147.854a.5.5 0 0 1 0-.708z"/>
//   </svg> Reload Sounds</button><button class="btn btn-primary btn-sm mr-1" onclick="openSoundsDir()"><svg class="bi bi-folder-symlink" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//   <path d="M9.828 4a3 3 0 0 1-2.12-.879l-.83-.828A1 1 0 0 0 6.173 2H2.5a1 1 0 0 0-1 .981L1.546 4h-1L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3v1z"/>
//   <path fill-rule="evenodd" d="M13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zM2.19 3A2 2 0 0 0 .198 5.181l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H2.19z"/>
//   <path d="M8.616 10.24l3.182-1.969a.443.443 0 0 0 0-.742l-3.182-1.97c-.27-.166-.616.036-.616.372V6.7c-.857 0-3.429 0-4 4.8 1.429-2.7 4-2.4 4-2.4v.769c0 .336.346.538.616.371z"/>
// </svg> Open Sounds Folder</button>`;
    if(sounds.length > 0){
        let buttonRowCount = 0;
        let buttonRows = 1;
        soundsHTML += `<table class="mx-auto">`;
        for(let s = 0; s < sounds.length; s++) {
            if(buttonRowCount == 3) {
                buttonRows++;
                buttonRowCount = 0;
                soundsHTML += `</tr><tr>`;
            }
            soundsHTML += `<td><button type="button" class="btn btn-secondary" style="height: 100%; width:100%;" onclick="playSound('${sounds[s]}')">${sounds[s].replace('.mp3','')}</button></td>`;
            buttonRowCount++;
        }
    }
    soundsHTML += `</tr></table>`;
    document.getElementById('soundsList').innerHTML = soundsHTML;
}

function playRandomSound() {
    ipc.send('playRandomSound');
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
        shell.openExternal(`https://id.twitch.tv/oauth2/authorize?client_id=rq2a841j8f63fndu5lnbwzwmbzamoy&redirect_uri=https://acceptdefaults.com/twitch-oauth-token-generator/&response_type=token&scope=bits:read+channel:read:redemptions+channel:moderate+chat:edit+chat:read+user:edit:broadcast`);
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

function changeActiveTab(activeTab) { 
    let navbar = document.getElementById('navBar-left');
    let navList = navbar.getElementsByTagName('li');
    for(let x = 0; x < navList.length; x++) {
        if(navList[x].classList.contains('active')) {
            navList[x].classList.remove('active');
        }
    }
    let newActive = document.getElementById(`${activeTab}Nav`);
    newActive.classList.add('active');
}

async function populateSettings(settingsPage) {
    if(settingsPage.toLowerCase() == 'home') { 
        // no settings
    }
    if(settingsPage.toLowerCase() == 'settings') {
        let result = await ipc.invoke('getCurrentSettings');
        if(result !== undefined) {
            document.getElementById('botUsername').value = result.username;
            document.getElementById('botToken').value = result.token;
            document.getElementById('clientId').value = result.clientId;
            document.getElementById('channel').value = result.channel;
            // document.getElementById('soundsDir').value = result.soundsDir;
            // document.getElementById('googleSheetsClientEmail').value = result.googleSheetsClientEmail;
            // document.getElementById('googleSheetsPrivateKey').value = result.googleSheetsPrivateKey;
            document.getElementById('beatSpreadSheetID').value = result.beatSpreadSheetID;
            document.getElementById('beatSheetID').value = result.beatSheetID;
            document.getElementById('beatGameSound').value = result.beatGameSound;
        }
        if(result.clientId === null) {
            document.getElementById('clientId').value = `rq2a841j8f63fndu5lnbwzwmbzamoy`;
        }
    }
    if(settingsPage.toLowerCase() == 'sounds') {
        await ipc.invoke('loadSounds');        
        let result = await ipc.invoke('getSoundsSettings');
        let soundsPageHTML = `<h3>Sounds</h3>`;
        if(result !== undefined) {
            soundsPageHTML += `<button type="submit" class="btn btn-primary btn-sm mr-1" onclick="saveSoundsForm()">Save</button><button class="btn btn-primary btn-sm mr-1" onclick="openSoundsDir()"><svg class="bi bi-folder-symlink" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.828 4a3 3 0 0 1-2.12-.879l-.83-.828A1 1 0 0 0 6.173 2H2.5a1 1 0 0 0-1 .981L1.546 4h-1L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3v1z"/>
            <path fill-rule="evenodd" d="M13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zM2.19 3A2 2 0 0 0 .198 5.181l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H2.19z"/>
            <path d="M8.616 10.24l3.182-1.969a.443.443 0 0 0 0-.742l-3.182-1.97c-.27-.166-.616.036-.616.372V6.7c-.857 0-3.429 0-4 4.8 1.429-2.7 4-2.4 4-2.4v.769c0 .336.346.538.616.371z"/>
          </svg> Open sounds folder</button><button class="btn btn-primary btn-sm mr-1" onclick="externalLink('manageRewards')"> Manage Channel Rewards</button><form id="soundsForm"><table class="table table-striped table-hover"><thead><tr><th scope="col">Filename</th><th scope="col">Reward Name (leave unchecked for random)</th></tr></thead><tbody>`;
            let randomSounds = result.random; 
            if(Object.keys(result.rewards).length > 0) {
                for(let sound in result.rewards) {
                    soundsPageHTML += `<tr id="${result.rewards[sound].filename}"><td id="filename"><svg onclick="playSound('${result.rewards[sound].filename}')" width="20px" height="20px" viewBox="0 0 16 16" class="bi bi-play mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                  </svg>${result.rewards[sound].filename.replace('.mp3','')}</td><td><div class="input-group mb-3">
                    <div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" checked>
                    </div></div>
                    <input type="text" class="form-control" value="${result.rewards[sound].name}"></div></td></tr>`;                    
                }
            }               
            if(randomSounds.length > 0) {
                for(let s = 0; s < randomSounds.length; s++) {
                    soundsPageHTML += `<tr id="${randomSounds[s]}"><td id="filename"><svg onclick="playSound('${randomSounds[s]}')" width="20px" height="20px" viewBox="0 0 16 16" class="bi bi-play mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                  </svg>${randomSounds[s].replace('.mp3','')}</td><td><div class="input-group mb-3">
                    <div class="input-group-prepend"><div class="input-group-text"><input type="checkbox">
                    </div></div>
                    <input type="text" class="form-control"></div></td></tr>`;
                }
            }
            soundsPageHTML += `</tbody></table></form><button type="submit" class="btn btn-primary btn-sm" onclick="saveSoundsForm()">Save</button>`;
        }
        document.getElementById('sounds').innerHTML = soundsPageHTML;
    }
    if(settingsPage.toLowerCase() == 'cmds') {
        let result = await ipc.invoke('getCurrentCommands');
        let cmdPageHTML = `<h3>Commands</h3>`;
        if(result !== undefined) {
            if(Object.keys(result)) {                
                cmdPageHTML += `<button type="submit" class="btn btn-primary btn-sm" onclick="saveCmdForm()">Save</button><form id="cmdForm"><table class="table table-striped table-hover table-sm" style="table-layout:auto;"><thead><th>Enabled</th><th>Command</th></thead><tbody>`;
                for(let cmd in result) { 
                    cmdPageHTML += `<tr id="${result[cmd].name}"><td style="width: 5px; text-align: center;">`;
                    if(result[cmd].enabled) {
                        cmdPageHTML += `<input type="checkbox" checked>`;
                    }
                    else {
                        cmdPageHTML += `<input type="checkbox">`;
                    }
                    cmdPageHTML += `</td><td>${result[cmd].name}</td></tr>`;
                }
                cmdPageHTML += `</tbody></table></form><button type="submit" class="btn btn-primary btn-sm" onclick="saveCmdForm()">Save</button>`;
                document.getElementById('cmds').innerHTML = cmdPageHTML;
            }
        }
    }
}

async function saveCmdForm() {
    let cmdForm = document.getElementById('cmdForm');
    let cmdTRs = cmdForm.getElementsByTagName('tr');
    let cmdChanges = {};
    for(let x = 1; x < cmdTRs.length; x++) { // skip 0, it's the header    
        let cmdName = cmdTRs[x].childNodes[1].innerText;
        let cmdStatus = cmdTRs[x].childNodes[0].childNodes[0].checked;
        cmdChanges[cmdName] = {
            name: cmdName,
            enabled: cmdStatus
        }
    }
    await ipc.invoke('updateCmdSettings', cmdChanges);
    alertMsg(true, 'success', 'Commands updated');
    showPage('cmds');
}

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
    let soundsForm = document.getElementById('soundsForm');
    let soundsTRs = soundsForm.getElementsByTagName('tr');
    let newChannelPointsSounds = {};
    let newRandomSounds = [];
    for(let x = 1; x < soundsTRs.length; x++) { // skip 0, it's the header
        let filename = (soundsTRs[x].childNodes[0].innerText).trim();
        let rewardName = (soundsTRs[x].childNodes[1].childNodes[0].childNodes[3].value).trim();
        let rewardEnabled = soundsTRs[x].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].checked;
        if(rewardEnabled) {
            newChannelPointsSounds[rewardName] = {
                name: rewardName,
                filename: filename
            }
        }
        else {
            newRandomSounds.push(filename);
        }    
    }
    let newSoundsSettings = [newChannelPointsSounds, newRandomSounds];
    await ipc.invoke('newSoundsSettings', newSoundsSettings);
    alertMsg(true, 'success', 'Sounds updated');
    showPage('sounds');
}

async function showPage(page) {
    let pages = ['home','settings','sounds','cmds'];
    let showPage;
    for(let p = 0; p < pages.length; p++) { 
        if(pages[p] == page.toLowerCase()) {
            showPage = pages[p];
        }
        document.getElementById(pages[p]).style.display = 'none';
    }
    await populateSettings(showPage);
    changeActiveTab(showPage);
    document.getElementById(showPage).style.display = 'block';
    // TO DO - change active tab in nav 
}

function saveSettingsFromForm() {
    let settingsForm = document.getElementById('settingsForm');
    let botSettingsFromForm = {
        botUsername: botUsername.value,
        botToken: botToken.value,
        clientId: clientId.value,
        channel: channel.value,
        // soundsDir: soundsDir.value,
        // googleSheetsClientEmail: googleSheetsClientEmail.value,
        // googleSheetsPrivateKey: googleSheetsPrivateKey.value,
        beatSpreadSheetID: beatSpreadSheetID.value,
        beatSheetID: beatSheetID.value,
        beatGameSound: beatGameSound.value
    }
    let result = ipc.invoke('botSettingsFromForm', botSettingsFromForm);
    /*
    botUsername
    botToken
    clientId
    channel
    soundsDir
    googleSheetsClientEmail
    googleSheetsPrivateKey
    beatSpreadSheetID
    beatSheetID
    beatGameSound
    */
}

function closeBot() {
    const botWindow = remote.getCurrentWindow();
    botWindow.close();
}

// async function closeBot() {
//     alertMsg(true, 'info', 'Shutting down...');
//     await ipc.invoke('closeBot');
// }
