const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const { shell } = require('electron');

ipc.on('status', (event, msg) => {
    updateStatus(msg);
});

function updateStatus(msg) {
    let statusBox = document.getElementById('status')
    statusBox.innerHTML += `&#13;&#10;${msg}`
    statusBox.scrollTop = statusBox.scrollWidth;
}

async function loadSettings() {
    let result = ipc.sendSync('getSettings');
    return result;
}

async function updateSoundsList() { 
    let sounds = await ipc.invoke('loadSounds');
    let soundsHTML = `<h3>Sounds</h3><button class="btn btn-primary btn-sm active" onclick="updateSoundsList()">Reload sounds</button><button class="btn btn-primary btn-sm active" onclick="openSoundsDir()">Open sounds folder</button>`;
    if(sounds.length > 0){
        let buttonRowCount = 0;
        let buttonRows = 1;
        soundsHTML += `<table>`;
        for(let s = 0; s < sounds.length; s++) {
            if(buttonRowCount == 3) {
                buttonRows++;
                buttonRowCount = 0;
                soundsHTML += `</tr><tr>`;
            }
            soundsHTML += `<td><button type="button" class="btn btn-secondary" style="height: 100%; width:100%;" onclick="playSound('${sounds[s]}')">${sounds[s]}</button></td>`;
            buttonRowCount++;
        }
    }
    soundsHTML += `</tr></table>`;
    document.getElementById('soundsList').innerHTML = soundsHTML;
}

function playSound(sound) {
   let audio = new Audio(`sounds\\${sound}`); // TO DO - get soundsDir from botsettings 
   try { audio.play(); }
   catch(err) { console.log(err); }
}

function checkWin() {
    ipc.send('checkWin');
}

async function openTokenPage() { 
    let result = await ipc.invoke('getCurrentSettings');
    shell.openExternal(`https://id.twitch.tv/oauth2/authorize?client_id=rq2a841j8f63fndu5lnbwzwmbzamoy&redirect_uri=https://acceptdefaults.com/twitch-oauth-token-generator/&response_type=token&scope=bits:read+channel:read:redemptions+channel:moderate+chat:edit+chat:read+user:edit:broadcast`);
}

async function openSoundsDir() {
    let result = await ipc.invoke('getCurrentSettings');
    if(result !== undefined) {
        shell.openPath(`${__dirname}\\${result.soundsDir}`);
    }
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
            document.getElementById('soundsDir').value = result.soundsDir;
            document.getElementById('googleSheetsClientEmail').value = result.googleSheetsClientEmail;
            document.getElementById('googleSheetsPrivateKey').value = result.googleSheetsPrivateKey;
            document.getElementById('beatSpreadSheetID').value = result.beatSpreadSheetID;
            document.getElementById('beatSheetID').value = result.beatSheetID;
            document.getElementById('beatGameSound').value = result.beatGameSound;
        }
    }
    if(settingsPage.toLowerCase() == 'sounds') {
        await ipc.invoke('loadSounds');        
        let result = await ipc.invoke('getSoundsSettings');
        let soundsPageHTML = `<h3>Sounds</h3>`;
        if(result !== undefined) {
            soundsPageHTML += `<button type="submit" class="btn btn-primary" onclick="saveSoundsForm()">Save</button><button class="btn btn-primary" onclick="openSoundsDir()">Open sounds folder</button><form id="soundsForm"><table class="table table-striped table-hover"><thead><tr><th scope="col">Filename</th><th scope="col">Reward Name (leave unchecked for random)</th></tr></thead><tbody>`;
            let randomSounds = result.random;
            if(Object.keys(result.rewards).length > 0) {
                for(let sound in result.rewards) {
                    soundsPageHTML += `<tr id="${result.rewards[sound].filename}"><td id="filename">${result.rewards[sound].filename}</td><td><div class="input-group mb-3">
                    <div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" checked>
                    </div></div>
                    <input type="text" class="form-control" value="${result.rewards[sound].name}"></div></td></tr>`;                    
                }
            }               
            if(randomSounds.length > 0) {
                for(let s = 0; s < randomSounds.length; s++) {
                    soundsPageHTML += `<tr id="${randomSounds[s]}"><td id="filename">${randomSounds[s]}</td><td><div class="input-group mb-3">
                    <div class="input-group-prepend"><div class="input-group-text"><input type="checkbox">
                    </div></div>
                    <input type="text" class="form-control"></div></td></tr>`;
                }
            }
            soundsPageHTML += `</tbody></table></form><button type="submit" class="btn btn-primary" onclick="saveSoundsForm()">Save</button>`;
        }
        document.getElementById('sounds').innerHTML = soundsPageHTML;
    }
    if(settingsPage.toLowerCase() == 'cmds') {
        let result = await ipc.invoke('getCurrentCommands');
        let cmdPageHTML = `<h3>Commands</h3>`;
        if(result !== undefined) {
            if(Object.keys(result)) {                
                cmdPageHTML += `<button type="submit" class="btn btn-primary" onclick="saveCmdForm()">Save</button><form id="cmdForm"><table class="table table-striped table-hover table-sm" style="table-layout:auto;"><thead><th>Enabled</th><th>Command</th></thead><tbody>`;
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
                cmdPageHTML += `</tbody></table></form><button type="submit" class="btn btn-primary" onclick="saveCmdForm()">Save</button>`;
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
        soundsDir: soundsDir.value,
        googleSheetsClientEmail: googleSheetsClientEmail.value,
        googleSheetsPrivateKey: googleSheetsPrivateKey.value,
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
