// const ipc = require('electron').ipcRenderer;
// const remote = require('electron').remote;
// const { shell } = require('electron');
var currentPage = `None`;

// console.log(window.varibot);

// ipc.on('status', (event, msg) => {
//     updateStatus(msg.type, msg.message);
// });

window.varibot.receive('status', (msg) => {
    updateStatus(msg.type, msg.message);
});

// ipc.on('updateRecentEvents', (event, args) => {
//     // console.log(args);
//     updateRecentEvents(args.image, args.user, args.msg);
// });

window.varibot.receive('updateRecentEvents', (recentEvent) => {
    updateRecentEvents(recentEvent.image, recentEvent.user, recentEvent.msg);
});

const validThemes = ['reptile', 'ermac', 'raiden'];

function applyTheme(theme) {
    if(validThemes.includes(theme)) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    else {
        document.documentElement.removeAttribute('data-theme');
    }
}

async function changeTheme(theme) {
    applyTheme(theme);
    await window.varibot.updateTheme(theme);
}

(async function initTheme() {
    let result = await window.varibot.getCurrentSettings();
    applyTheme(result !== undefined ? result.theme : undefined);
})();

function loadedGoogleCredsFile(savedResult) {
    if(savedResult) {
        alertMsg(true, 'success', 'Google creds file saved.')        
        let googleCredsUploadButton = document.getElementById('googleCredsUploadButton'); 
        googleCredsUploadButton.innerHTML = `Google Creds File Saved &#10003;`
        googleCredsUploadButton.classList.add('btn-success');
        googleCredsUploadButton.classList.remove('btn-dark');
    }
    else {
        alertMsg(true, 'error', 'Error saving Google creds file. See status box for details.')
        let googleCredsUploadButton = document.getElementById('googleCredsUploadButton'); 
        googleCredsUploadButton.innerHTML = `Error saving file &#10007;`
        googleCredsUploadButton.classList.add('btn-danger');
        googleCredsUploadButton.classList.remove('btn-dark');
    }
}

function openGoogleCredsFile() {
    // ipc.invoke('loadGoogleCredsFile');
    window.varibot.loadGoogleCredsFile();
}

function updateRecentEvents(image,user,msg) {
    let recentList = document.getElementById('recentList');
    let userImg = ``;
    let userDisplayName = `error`;
    switch(user) {
        case 'system': {
        //     userImg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        //     <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        //     <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
        //   </svg>`;
            userImg = ``;
            userDisplayName = `System:`;
            break;
        }
        case 'you': {
        //     userImg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
        //     <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        //   </svg>`;
            userImg = ``;          
            userDisplayName = `You`;
            break;
        }
        default: {
            userImg = `<img src="${image}" width="30px" height="30px">`;
            userDisplayName = user;
            break;
        }
    }
    let now = new Date();
    let pad = n => String(n).padStart(2, '0');
    let timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    recentList.innerHTML = `<tr><td class="feed-time">${timeStr}</td><td>${userImg}</td><td><span class='text-primary'>${userDisplayName}</span> ${msg}</td></tr>${recentList.innerHTML}`;
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

function runAd() {
    // ipc.invoke('runAd');
    window.varibot.runAd();
}

function createStreamMarker() {
    // ipc.invoke('createStreamMarker');
    window.varibot.createStreamMarker();
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
        document.getElementById('chatBotStatusIcon').innerHTML = `${newStatusIcon} Chat bot`;
        document.getElementById('aboutChatBotStatus').innerHTML = `Chat bot status: ${newStatusMessage}`;
    }
    
    if(service == 'eventSub') {
        document.getElementById('eventSubStatusIcon').innerHTML = `${newStatusIcon} EventSub`;
        document.getElementById('aboutEventSubStatus').innerHTML = `EventSub status: ${newStatusMessage}`;
    }

}

function updateChannelIcon(iconUrl) {
    if(iconUrl !== undefined) {
        document.getElementById('userAvatar').src = iconUrl;
    }
}

async function updateSoundsList() { 
    let sounds = await window.varibot.loadSounds();
    sounds = sounds.filter(sound => sound && typeof sound === 'string' && sound.endsWith('.mp3'));
    sounds.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
    let soundsHTML = '';
    let randomColorMode = false;
    let buttonColors = ['btn-primary', 'btn-secondary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info', 'btn-light'];
    if (sounds.length > 0) {
        soundsHTML = sounds.map(sound => {
            const displayName = sound
                .replace('.mp3', '')
                .replace(/_/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
            let buttonClass = randomColorMode ? buttonColors[Math.floor(Math.random() * buttonColors.length)] : 'btn-dark';
            return `<button type=\"button\" class=\"btn ${buttonClass}\" onclick=\"playSound('${sound}')\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><polygon points=\"5,3 19,12 5,21\"/></svg>${displayName}</button>`;
        }).join('');
    } else {
        soundsHTML = '<p class=\"text-muted\">No sounds available. Add .mp3 files to the sounds folder.</p>';
    }
    document.getElementById('soundboard').innerHTML = soundsHTML;
    document.getElementById('soundboardCount').textContent = `${sounds.length} LOADED`;
}

function playRandomSound() {
    // ipc.invoke('playRandomSound');
    window.varibot.playRandomSound();
}

async function playSound(sound) {
    let result = await window.varibot.getCurrentSettings();
    if(result !== undefined) {
        // Always play sound as string
        if(Array.isArray(sound)) {
            // Play first sound in array
            sound = sound[0];
        }
        let audio = new Audio(`${result.soundsDir}\\${sound}`);
        try { audio.play(); }
        catch(err) { console.log(err); }
    }    
}

// function checkWin() {
//     ipc.send('checkWin');
// }

async function externalLink(destination) {
    // let result = await ipc.invoke('getCurrentSettings');   
    if(destination == 'token') {
        window.open(`https://id.twitch.tv/oauth2/authorize?client_id=rq2a841j8f63fndu5lnbwzwmbzamoy&redirect_uri=https://acceptdefaults.com/twitch-oauth-token-generator/&response_type=token&scope=bits:read+channel:read:redemptions+channel:manage:redemptions+channel:moderate+chat:edit+chat:read+user:edit:broadcast+channel:edit:commercial`, '_blank');
    } else if(destination == 'manageRewards') {
        let result = await window.varibot.getCurrentSettings();   
        // window.open(`https://dashboard.twitch.tv/u/${result.username.toLowerCase()}/community/channel-points/rewards`, '_blank');
        window.varibot.openWebpage(`https://dashboard.twitch.tv/u/${result.username.toLowerCase()}/community/channel-points/rewards`);
    } else if(destination == 'wiki') {
        // window.open(`https://github.com/VariXx/varibot-twitch-js/wiki`, '_blank');
        window.varibot.openWebpage(`https://github.com/VariXx/varibot-twitch-js/wiki`);
    } else if(destination == 'discord') {
        window.open(`https://discord.gg/QNppY7T`, '_blank');
    } else if(destination == 'botSettingsHelp') {
        window.open(`https://github.com/VariXx/varibot-twitch-js/wiki/Settings#general-settings`, '_blank');
    } else if(destination == 'googleSheetsHelp') {
        window.open(`https://github.com/VariXx/varibot-twitch-js/wiki/Settings#google-spreadsheets-settings`, '_blank');
    } else if(destination == 'chatPopout') {
        let result = await window.varibot.getCurrentSettings();   
        window.open(`https://www.twitch.tv/popout/${result.username}/chat`, '_blank');
    } else if(destination == 'twitchDashboard') {
        let result = await window.varibot.getCurrentSettings();   
        window.varibot.openWebpage(`https://dashboard.twitch.tv/u/${result.username}/stream-manager`);
    } else if(destination == 'twitchRewardQueue') {
        let result = await window.varibot.getCurrentSettings();   
        // window.varibot.openWebpage(`https://www.twitch.tv/popout/${result.username}/reward-queue`);        
        window.open(`https://www.twitch.tv/popout/${result.username}/reward-queue`);        
    }
}

async function openDir(dirToOpen) {
    // let result = await ipc.invoke('getCurrentSettings');
    let result = await window.varibot.getCurrentSettings();
    if(result !== undefined) {
        if(dirToOpen == 'sounds' || dirToOpen == 'configs') {               
            window.varibot.openDir(`${dirToOpen}`);
        }
    }
}

function changeActiveTab(activeTab) { 
    let navBar = document.getElementById('navBarList');
    // let navList = navBar.getElementsByTagName('li');
    let navList = navBar.getElementsByClassName('nav-link');
    for(let x = 0; x < navList.length; x++) {
        if(navList[x].classList.contains('active')) {
            navList[x].classList.remove('active');
        }
    }
    let newActive = document.getElementById(`${activeTab}Nav`);
    newActive.classList.add('active');
    // console.log(`Changed to ${activeTab}`);
}

async function populateSettings(settingsPage) {
    if(settingsPage == 'home') { 
        updateSoundsList();
    }
    if(settingsPage == 'settings') {
        // let result = await ipc.invoke('getCurrentSettings');
        let result = await window.varibot.getCurrentSettings();
        if(result !== undefined) {
            document.getElementById('botTheme').value = validThemes.includes(result.theme) ? result.theme : 'sub-zero';
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

        // let cmdsResult = await ipc.invoke('getCurrentCommands');
        let cmdsResult = await window.varibot.getCurrentCommands();
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
    if(settingsPage == 'pointsSounds') {
        // await ipc.invoke('loadSounds');        
        await window.varibot.loadSounds();        
        // let soundsList = await ipc.invoke('getSoundsSettings');
        let soundsList = await window.varibot.getSoundsSettings();
        // let channelRewards = await ipc.invoke('getChannelRewards');
        let channelRewards = await window.varibot.getChannelRewards();
        let channelRewardsTable = document.getElementById('channelRewardsTable');
        let channelRewardsTableHTML = ``;
        if(channelRewards !== undefined && channelRewards.length > 0) {
            channelRewardsTableHTML += `<tr><th></th><th>Channel Reward</th><th>Sound(s)</th></tr>`;
            // Build a unique list of all available sounds
            let allSoundsSet = new Set();
            for(let s in soundsList.rewards) {
                let filename = soundsList.rewards[s].filename;
                if(Array.isArray(filename)) {
                    filename.forEach(f => allSoundsSet.add(f));
                } else if(typeof filename === 'string') {
                    allSoundsSet.add(filename);
                }
            }
            if(Array.isArray(soundsList.random)) {
                soundsList.random.forEach(f => allSoundsSet.add(f));
            }
            let allSounds = Array.from(allSoundsSet);
            allSounds.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
            for(let reward = 0; reward < channelRewards.length; reward++) {
                if(channelRewards[reward].title.toLowerCase() == 'random sound') {
                    continue;
                }
                let rewardImage = channelRewards[reward].default_image.url_1x;
                if(channelRewards[reward].image !== null){
                    rewardImage = channelRewards[reward].image.url_1x;
                }
                let selectId = `${channelRewards[reward].title}`;
                let searchId = `${selectId}SoundSearch`;
                let clearId = `${selectId}ClearBtn`;
                let soundRewardHTMLStart = `<tr id="${selectId}Row"><td><img src="${rewardImage}"></td><td name="channelRewardName">${channelRewards[reward].title}</td><td class="mw-25">`;
                soundRewardHTMLStart += `<div class="search-box mb-1"><input type="text" class="form-control form-control-sm" id="${searchId}" placeholder="Search sounds..." oninput="filterSoundOptions('${selectId}','${searchId}')"><button type="button" class="search-clear" onclick="clearRewardSearch('${selectId}','${searchId}')" aria-label="Clear search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>`;
                soundRewardHTMLStart += `<select class="custom-select custom-select-sm w-100 mb-2" id="${selectId}" name="channelRewardSound" multiple>`;
                let soundRewardHTMLInner = `<option value=\"none\">none</option>`;
                let selectedFilenames = [];
                // Always expect array, but catch if not
                try {
                    for(let s in soundsList.rewards) {
                        if(channelRewards[reward].title.toLowerCase() == soundsList.rewards[s].name.toLowerCase()) {
                            let filenames = soundsList.rewards[s].filename;
                            if(Array.isArray(filenames)) {
                                selectedFilenames = filenames;
                            } else if (typeof filenames === 'string') {
                                selectedFilenames = [filenames];
                            } else {
                                selectedFilenames = [];
                            }
                        }
                    }
                } catch (err) {
                    selectedFilenames = [];
                }
                // Show all sounds, mark assigned as selected
                for(let i = 0; i < allSounds.length; i++) {
                    let filename = allSounds[i];
                    let selected = selectedFilenames.includes(filename) ? 'selected' : '';
                    soundRewardHTMLInner += `<option value=\"${filename}\" ${selected}>${filename}</option>`;
                }
                soundRewardHTMLStart += `>`;
                let soundRewardHTMLEnd = `</select><button type="button" class="btn btn-dark btn-sm mb-1" style="width:120px;" id="${clearId}" onclick="clearSoundSelection('${selectId}')">Clear sounds</button></td></tr>`;
                channelRewardsTableHTML += soundRewardHTMLStart + soundRewardHTMLInner + soundRewardHTMLEnd;
            }
        }
        channelRewardsTable.innerHTML = channelRewardsTableHTML;
        // Add filterSoundOptions and clearSoundSelection functions to window for search boxes
        window.filterSoundOptions = function(selectId, searchId) {
            let searchValue = document.getElementById(searchId).value.toLowerCase();
            let select = document.getElementById(selectId);
            for(let i = 0; i < select.options.length; i++) {
                let option = select.options[i];
                let text = option.text.toLowerCase();
                // Always show 'none' option
                if(option.value === 'none') {
                    option.style.display = '';
                    continue;
                }
                if(text.includes(searchValue)) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            }
        };
        window.clearSoundSelection = function(selectId) {
            let select = document.getElementById(selectId);
            for(let i = 0; i < select.options.length; i++) {
                select.options[i].selected = false;
            }
        };
        window.clearRewardSearch = function(selectId, searchId) {
            let input = document.getElementById(searchId);
            input.value = '';
            window.filterSoundOptions(selectId, searchId);
            input.focus();
        };
        // Make option clicks toggle selection without Ctrl/Shift and handle 'none' selection
        let selects = document.getElementsByName('channelRewardSound');
        for(let s = 0; s < selects.length; s++) {
            selects[s].addEventListener('mousedown', function(e) {
                e.preventDefault();
                let option = e.target;
                if(option.tagName.toLowerCase() !== 'option') return;
                if(option.value === 'none') {
                    // Clear all selections if 'none' is clicked
                    for(let i = 0; i < this.options.length; i++) {
                        this.options[i].selected = false;
                    }
                    option.selected = true;
                } else {
                    option.selected = !option.selected;
                    // Unselect 'none' if another option is selected
                    let noneOption = this.querySelector('option[value="none"]');
                    if(noneOption) noneOption.selected = false;
                }
            });
        }
    }
    if(settingsPage == 'about') {
        // let result = await ipc.invoke('getAbout');
        let result = await window.varibot.getAbout();
        document.getElementById('aboutBotVersion').innerHTML = `VariBot v${result.versionNumber}`;
        document.getElementById('aboutSoundsLoaded').innerHTML = `Random sounds loaded: ${result.randomSoundsCount}`;
        document.getElementById('aboutChannelRewardsLoaded').innerHTML = `Channel reward sounds loaded: ${result.channelPointsSoundsCount}`;
        document.getElementById('aboutGoogleCredsLoaded').innerHTML = `Google creds file loaded: ${result.googleCredsExist}`;
    }
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
    let newChannelRewards = document.getElementsByName('channelRewardSound');
    let newpointsSoundsSounds = {};
    for(let cr = 0; cr < newChannelRewards.length; cr++) {
        let selectedOptions = [];
        for(let x = 0; x < newChannelRewards[cr].options.length; x++ ){
            if(newChannelRewards[cr].options[x].selected && newChannelRewards[cr].options[x].value !== 'none') {
                selectedOptions.push(newChannelRewards[cr].options[x].value);
            }
        }
        if(selectedOptions.length > 0) {
            newpointsSoundsSounds[newChannelRewards[cr].id] = {
                name: newChannelRewards[cr].id,
                filename: selectedOptions // always array
            }
        }
    }
    await window.varibot.newSoundsSettings(newpointsSoundsSounds);
    alertMsg(true, 'success', 'Sounds updated');
    showPage('pointsSounds');
}

async function showPage(page) {
    let pages = ['home','settings','pointsSounds','about'];
    let showPage;
    for(let p = 0; p < pages.length; p++) { 
        if(pages[p] == page) {
            showPage = pages[p];
        }
        document.getElementById(pages[p]).style.display = 'none';
    }
    await populateSettings(showPage);
    currentPage = showPage;
    changeActiveTab(showPage);
    document.getElementById(showPage).style.display = 'block';
    document.getElementById('crumbPage').textContent = showPage === 'pointsSounds' ? 'sounds' : showPage;
}

async function saveSettingsFromForm() {
    let botSettingsFromForm = {
        botUsername: document.getElementById('botUsername').value,
        botToken: document.getElementById('botToken').value,
        clientId: document.getElementById('clientId').value,
        channel: document.getElementById('channel').value,
        theme: document.getElementById('botTheme').value,
        beatGameSound: document.getElementById('beatGameSound').value
    }
    applyTheme(botSettingsFromForm.theme);

    let cmdList = document.getElementsByName('cmdSettingCheckbox');
    let cmdChanges = {};    
    for(let c = 0; c < cmdList.length; c++) {
        let cmdName = cmdList[c].id.trim();
        let cmdStatus = cmdList[c].checked;
        cmdChanges[cmdName] = {
            name: cmdName,
            enabled: cmdStatus
        }
    }
    // await ipc.invoke('updateCmdSettings', cmdChanges);
    await window.varibot.updateCmdSettings(cmdChanges);

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
    
    // let result = ipc.invoke('botSettingsFromForm', botSettingsFromForm);
    let result = window.varibot.botSettingsFromForm(botSettingsFromForm);
    showPage('home');    
}

