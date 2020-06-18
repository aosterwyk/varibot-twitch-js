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
    // let soundsHTML = `<h3>Sounds <span onclick="reloadSounds()">(reload)</span></h3><ulc lass="list-group">`; // this doesn't work because sounds only load once right now but it's the right idea
    let soundsHTML = `<h3>Sounds</h3><ulc lass="list-group">`;
    sounds.forEach(sound => {
        soundsHTML += `<li class="list-group-item" onclick="playSound('${sound}')">${sound}</li>`;
    });    
    soundsHTML += `</ul></div>`;
    document.getElementById('soundsList').innerHTML = soundsHTML;
}

function playSound(sound) {
   let audio = new Audio(sound);
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

    }
    if(settingsPage.toLowerCase() == 'points') {

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

// TO DO - load settings and populate form with existing settings

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

showPage('home');

