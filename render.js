const { visible, hidden } = require('chalk');

const ipc = require('electron').ipcRenderer;

ipc.on('status', (event, msg) => {
    // console.log(`status`);
    // console.log(event);
    // console.log(msg);
    updateStatus(msg);
});

function updateStatus(msg) {
    // console.log(`status ${msg}`);
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
    let soundsHTML = `<h3>Sounds</h3><button onclick="updateSoundsList()">(reload)</button>`;
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

async function populateSettings(settingsPage) {
    if(settingsPage.toLowerCase() == 'home') { 
        // no settings
    }
    if(settingsPage.toLowerCase() == 'settings') {
        let result = await ipc.invoke('getCurrentSettings');
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
    if(settingsPage.toLowerCase() == 'sounds') {
        let result = await ipc.invoke('getSoundsSettings');
        let soundsPageHTML = `<h3>Sounds</h3>`;
        if(result !== undefined) {
            soundsPageHTML += `<form id="soundsForm"><table class="table table-striped table-hover"><thead><tr><th scope="col">Filename</th><th scope="col">Reward Name (leave unchecked for random)</th></tr></thead><tbody>`;
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
    if(settingsPage.toLowerCase() == 'points') {

    }
}

function saveSoundsForm() {
    let soundsForm = document.getElementById('soundsForm');
    let soundsTRs = soundsForm.getElementsByTagName('tr');
    // console.log(soundsTRs);
    // console.log(soundsForm);
    for(let x = 1; x < soundsTRs.length; x++) { // skip 0, it's the header
        // console.log(soundsTRs[x].id);
        let filename = soundsTRs[x].childNodes[0].innerText;
        let rewardName = soundsTRs[x].childNodes[1].childNodes[0].childNodes[3].value;
        let rewardEnabled = soundsTRs[x].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].checked;
        
        console.log(`Filename ${filename} Reward Name: ${rewardName} Enabled: ${rewardEnabled}`);
        // trim these before sending to DB         
        // add these to an object, find which sounds have rewards set/enabled, put the others in random sounds array, update DB then reload sounds 
    }

}

async function showPage(page) {
    let pages = ['home','settings','sounds','points'];
    let showPage;
    for(let p = 0; p < pages.length; p++) { 
        if(pages[p] == page.toLowerCase()) {
            showPage = pages[p];
        }
        // document.getElementById(pages[p]).style.visibility = 'hidden';
        document.getElementById(pages[p]).style.display = 'none';
    }
    // document.getElementById(showPage).style.visibility = 'visible';
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

