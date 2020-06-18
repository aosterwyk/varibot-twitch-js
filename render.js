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
   let audio = new Audio(`sounds\\${sound}`);
   try { audio.play(); }
   catch(err) { console.log(err); }
}

function checkWin() {
    ipc.send('checkWin');
}

function showPage(page) {
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
    // console.log(settingsForm.botUsername.value);
    // console.log(settingsForm.exampleInputEmail1.value);
    // console.log(settingsForm.clientId.value);
    // console.log(settingsForm.exampleInputEmail1.value);
    // console.log(settingsForm.soundsDir.value);
    // console.log(settingsForm.googleSheetsClientEmail.value);
    // console.log(settingsForm.googleSheetsPrivateKey.value);
    // console.log(settingsForm.beatSpreadSheetID.value);
    // console.log(settingsForm.beatSheetID.value);
    // console.log(settingsForm.beatGameSound.value);
    // <input type="text" class="form-control" id="botUsername" placeholder="Enter username">
    // <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter token">
    // <input type="text" class="form-control" id="clientId" placeholder="Enter username" value="rq2a841j8f63fndu5lnbwzwmbzamoy">
    // <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter channel">
    // <input type="text" class="form-control" id="soundsDir" placeholder="Enter sounds directory" value="sounds/">
    // <input type="text" class="form-control" id="googleSheetsClientEmail" placeholder="Enter client email address">
    // <input type="text" class="form-control" id="googleSheetsPrivateKey" placeholder="Enter private key">
    // <input type="text" class="form-control" id="beatSpreadSheetID" placeholder="Enter ID">
    // <input type="text" class="form-control" id="beatSheetID" placeholder="Enter ID">
    // <input type="text" class="form-control" id="beatGameSound" placeholder="Enter filename">
}

showPage('home');

