const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const { shell } = require('electron');
var currentPage = `None`;

ipc.on('status', (event, msg) => {
    updateStatus(msg.type, msg.message);
});

ipc.on('updateRecentEvents', (event, args) => {
    // console.log(args);
    updateRecentEvents(args.image, args.user, args.msg);
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
    recentList.innerHTML = `<tr><td>${userImg}</td><td><span class='text-primary'>${userDisplayName}</span> ${msg}</td></tr>${recentList.innerHTML}`;
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

async function identifyLight(lightId) {
    ipc.invoke('identifyLight',lightId);
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
        shell.openExternal(`https://id.twitch.tv/oauth2/authorize?client_id=rq2a841j8f63fndu5lnbwzwmbzamoy&redirect_uri=https://acceptdefaults.com/twitch-oauth-token-generator/&response_type=token&scope=bits:read+channel:read:redemptions+channel:manage:redemptions+channel:moderate+chat:edit+chat:read+user:edit:broadcast+channel:edit:commercial`);
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

async function openDir(dirToOpen) {
    let result = await ipc.invoke('getCurrentSettings');
    if(result !== undefined) {
        if(dirToOpen == 'sounds') {               
            shell.openPath(`${result.soundsDir}`);
        }
        if(dirToOpen == 'configs') {               
            shell.openPath(`${result.configsDir}`);
        }
    }
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
    if(settingsPage == 'home') { 
        updateSoundsList();
    }
    if(settingsPage == 'pointsHue') {
        const hueSettings = await getHueSettings();
        // console.log(hueSettings);
        if(hueSettings !== undefined) {
            if(hueSettings.bridgeIP !== undefined) {
                document.getElementById('hueBridgeConnectSetttings').style.display = 'block';
                document.getElementById('hueBridgeIP').value = hueSettings.bridgeIP;
                if(hueSettings.username !== undefined) {
                    document.getElementById('hueBridgeConnectSetttings').style.display = 'none';                    
                    document.getElementById('hueBridgeLightsSettings').style.display = 'block';
                    document.getElementById('hueBridgeRewardSettings').style.display = 'block';
                    let hueLights = await getAllLights();
                    if(hueLights !== undefined) {
                        let hueLightSettings = await getHueAlertsSettings('channelPointsLights');
                        // console.log(hueLightSettings);
                        let hueLightsTable = document.getElementById('hueLightsTable');
                        let hueLightsTableHTML = '';
                        for(lightID in hueLights) {
                            hueLightsTableHTML += `<tr><td>${hueLights[lightID].name}</td><td><input name="lightRewardEnabled" type="checkbox" id="${lightID}"`;;
                            if(hueLightSettings[lightID]) {
                                hueLightsTableHTML += ` checked `;
                            }
                            hueLightsTableHTML += `></td><td><button class="btn-secondary btn-sm" onclick="identifyLight(${lightID})">Identify</button></tr>`;
                        }
                        hueLightsTable.innerHTML = hueLightsTableHTML;
                        let channelRewards = await ipc.invoke('getChannelRewards');
                        let loadedHueRewardsList = await getHueAlertsSettings('channelPointsRewards');
                        // console.log(loadedHueRewardsList);
                        let hueChannelRewardsTable = document.getElementById('hueRewardsTable');
                        let hueChannelRewardsTableHTML = ``;
                        if(channelRewards !== undefined && channelRewards.length > 0) {
                            for(let reward = 0; reward < channelRewards.length; reward++) {
                                // if(channelRewards[reward].title.toLowerCase() == 'random sound') {
                                //     continue;
                                // }
                                let rewardImage = channelRewards[reward].default_image.url_1x
                                if(channelRewards[reward].image !== null){
                                    rewardImage = channelRewards[reward].image.url_1x;
                                }
                                hueChannelRewardsTableHTML += `<tr id="${channelRewards[reward].title}"><td><img src="${rewardImage}"></td><td name="hueChannelRewardName">${channelRewards[reward].title}</td>`;
                                hueChannelRewardsTableHTML += `<td><select class="custom-select" onchange="checkLightRewards()" id="${channelRewards[reward].title}" name="hueRewards">
                                <option name="rewardEffects" id="${channelRewards[reward].title}rewardEffect" value="none" selected>None</option>
                                <option name="rewardEffects" id="${channelRewards[reward].title}rewardEffect" value="staticColor">Static color</option>
                                <option name="rewardEffects" id="${channelRewards[reward].title}rewardEffect" value="userColor">User color</option>                                     
                                <option name="rewardEffects" id="${channelRewards[reward].title}rewardEffect" value="flash">Flash lights</option>
                                <option name="rewardEffects" id="${channelRewards[reward].title}rewardEffect" value="randomColor">Random color</option>
                                <option name="rewardEffects" id="${channelRewards[reward].title}rewardEffect" value="colorLoop">Color loop</option>
                                </select></td>
                                <td><input type="text" id="${channelRewards[reward].title}rewardEffectlightStaticColor" placeholder="Color" style="display:none;"></td>
                                </tr>`;
                            }
                            hueChannelRewardsTable.innerHTML = hueChannelRewardsTableHTML;
                            
                            // select loaded options
                            try {
                                let hueRewards = document.getElementsByName('hueRewards');
                                // console.log(hueRewards);
                                for(let r in hueRewards) { 
                                    if(hueRewards[r].id in loadedHueRewardsList) {
                                        let foundHueRewardName = hueRewards[r].id; 
                                        // console.log(`Found ${hueRewards[r].id}`);
                                        // console.log(loadedHueRewardsList[foundHueRewardName].effect);
                                        // console.log(hueRewards[r]);
                                        let hueRewardsOptions = hueRewards[r].getElementsByTagName('option');
                                        for(let rewardOption = 0; rewardOption < hueRewardsOptions.length; rewardOption++) {
                                            if(hueRewardsOptions[rewardOption].value.toLowerCase() == loadedHueRewardsList[foundHueRewardName].effect.toLowerCase()) {
                                                hueRewardsOptions[rewardOption].selected = true;
                                                if(hueRewardsOptions[rewardOption].value.toLowerCase() == 'staticcolor') {
                                                    checkLightRewards();
                                                    // TO DO - fill in static color if set
                                                }
                                            }
                                        }
                                        // console.log(hueRewardsOptions);
                                    }
                                }
                            }
                            catch(error) { console.log(error) }                            
                        }
                        
                    }
                }
            }
        }
    }
    if(settingsPage == 'settings') {
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
    if(settingsPage == 'pointsSounds') {
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
                // channelRewardsTableHTML += `<tr id="${channelRewards[reward].title}Row"><td><img src="${rewardImage}"></td><td name="channelRewardName">${channelRewards[reward].title}</td></li></ul></td><td><select class="custom-select custom-select-sm w-100" id="${channelRewards[reward].title}" name="channelRewardSound">`;
                let soundRewardHTMLStart = `<tr id="${channelRewards[reward].title}Row"><td><img src="${rewardImage}"></td><td name="channelRewardName">${channelRewards[reward].title}</td></li></ul></td><td class="mw-25"><select class="custom-select custom-select-sm w-100" id="${channelRewards[reward].title}" name="channelRewardSound"`;
                let soundRewardHTMLInner = ``;
                let foundRewardSound = false; 
                let rewardSoundMulti = false;
                for(let s in soundsList.rewards) {
                    // console.log(soundsList.rewards[s].filename);                    
                    if(channelRewards[reward].title.toLowerCase() == soundsList.rewards[s].name.toLowerCase()) {
                        // channelRewardsTableHTML += `<option value="${soundsList.rewards[s].filename}" selected>`;
                        if(Array.isArray(soundsList.rewards[s].filename)) {
                            console.log(`${soundsList.rewards[s].name} is an array`);
                            rewardSoundMulti = true;
                            console.log(soundsList.rewards[s].filename);                            
                            for(let x = 0; x < soundsList.rewards[s].filename.length; x++) {
                                console.log(soundsList.rewards[s].filename[x]);
                                soundRewardHTMLInner += `<option value="${soundsList.rewards[s].filename[x]}" selected>${soundsList.rewards[s].filename[x]}</option>`;                                
                            }
                        }
                        else {
                            soundRewardHTMLInner += `<option value="${soundsList.rewards[s].filename}" selected>`;
                        }
                        foundRewardSound = true;
                    }
                    else {
                        // channelRewardsTableHTML += `<option value="${soundsList.rewards[s].filename}">`;
                        soundRewardHTMLInner += `<option value="${soundsList.rewards[s].filename}">`;
                    }   
                    // channelRewardsTableHTML += `${soundsList.rewards[s].filename}</option>`;
                    if(!rewardSoundMulti) {
                        soundRewardHTMLInner += `${soundsList.rewards[s].filename}</option>`;
                    }
                }
                for(let snd = 0; snd < soundsList.random.length; snd++) {
                    // channelRewardsTableHTML += `<option value="${soundsList.random[snd]}">${soundsList.random[snd]}</option>`;
                    soundRewardHTMLInner += `<option value="${soundsList.random[snd]}">${soundsList.random[snd]}</option>`;
                }
                if(foundRewardSound) {
                    // channelRewardsTableHTML += `<option value="none">none</option></td></tr>`;
                    // channelRewardsTableHTML += `<option value="none">none</option></td>`;
                    soundRewardHTMLInner += `<option value="none">none</option></td>`;
                }
                else {
                    // channelRewardsTableHTML += `<option value="none" selected>none</option></td></tr>`;
                    // channelRewardsTableHTML += `<option value="none" selected>none</option></td>`;
                    soundRewardHTMLInner += `<option value="none" selected>none</option></td>`;
                }
                if(rewardSoundMulti) {
                    soundRewardHTMLStart += `multiple`;
                }
                soundRewardHTMLStart += `>`;
                // channelRewardsTableHTML += `<td><input type="checkbox" id="${channelRewards[reward].title}MultiCheckbox" onchange="setSoundRewardMultiple('${channelRewards[reward].title}')"></td></tr>`;
                let soundRewardHTMLEnd = `<td><input type="checkbox" id="${channelRewards[reward].title}MultiCheckbox" onchange="setSoundRewardMultiple('${channelRewards[reward].title}')"`;
                if(rewardSoundMulti) {
                    soundRewardHTMLEnd += `checked`;
                }
                soundRewardHTMLEnd += `></td></tr>`;
                channelRewardsTableHTML += soundRewardHTMLStart + soundRewardHTMLInner + soundRewardHTMLEnd;
            }
        }
        channelRewardsTable.innerHTML = channelRewardsTableHTML;
    }
    if(settingsPage == 'about') {
        let result = await ipc.invoke('getAbout');
        document.getElementById('aboutBotVersion').innerHTML = `VariBot v${result.versionNumber}`;
        document.getElementById('aboutSoundsLoaded').innerHTML = `Random sounds loaded: ${result.randomSoundsCount}`;
        document.getElementById('aboutChannelRewardsLoaded').innerHTML = `Channel reward sounds loaded: ${result.pointsSoundsSoundsCount}`;
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
    let newRandomSounds = {};
    let soundRewardFilename
    for(let cr = 0; cr < newChannelRewards.length; cr++) {
        // console.log(`Name: ${newChannelRewards[cr].id} Value: ${newChannelRewards[cr].value}`);
        if(newChannelRewards[cr].value != 'none') {
            if(newChannelRewards[cr].multiple) {
                // console.log(`${newChannelRewards[cr].id} is a multiple, listing all selections`);
                let selectedOptions = [];
                for(let x = 0; x < (newChannelRewards[cr].options).length; x++ ){
                    // console.log(newChannelRewards[cr].options[x]);
                    if(newChannelRewards[cr].options[x].selected) {
                    // add filename to array if selected
                        selectedOptions.push(newChannelRewards[cr].options[x].value);
                    }
                }
                // console.log(selectedOptions);
                soundRewardFilename = selectedOptions;
                // console.log(newChannelRewards[cr].options);
            }
            else {
                soundRewardFilename = newChannelRewards[cr].value;
            }
            newpointsSoundsSounds[newChannelRewards[cr].id] = {
                name: newChannelRewards[cr].id,
                filename: soundRewardFilename
            }
        }
    }

    await ipc.invoke('newSoundsSettings', newpointsSoundsSounds);
    alertMsg(true, 'success', 'Sounds updated');
    showPage('pointsSounds');
}

async function showPage(page) {
    let pages = ['home','settings','pointsSounds','pointsHue','about'];
    let showPage;
    for(let p = 0; p < pages.length; p++) { 
        if(pages[p] == page) {
            showPage = pages[p];
        }
        document.getElementById(pages[p]).style.display = 'none';
    }
    await populateSettings(showPage);
    currentPage = showPage;
    // changeActiveTab(showPage);
    document.getElementById(showPage).style.display = 'block';
}

async function lightHelpList(state) {
    let lightHelpList = document.getElementById('lightHelpList');
    if(state == 'show') {
        lightHelpList.style.display = 'block';
    }
    else {
        lightHelpList.style.display = 'none';    
    }
}

async function saveSettingsFromForm() {
    let botSettingsFromForm = {
        botUsername: document.getElementById('botUsername').value,
        botToken: document.getElementById('botToken').value,
        clientId: document.getElementById('clientId').value,
        channel: document.getElementById('channel').value,
        beatGameSound: document.getElementById('beatGameSound').value
    }

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

function toggleElement(ele,status) {
    try {
        let changeThis = document.getElementById(ele);
        if(status) {
            changeThis.style.display = 'block';
        }
        else {
            changeThis.style.display = 'none';
        }
    }
    catch(error) {
        console.log(error);
    }
}

function checkLightRewards() { 
    let rewardEffects = document.getElementsByName('rewardEffects');
    for(let effect in rewardEffects) {
        if(rewardEffects[effect].selected) {
            if(rewardEffects[effect].value == "staticColor") {
                toggleElement(`${rewardEffects[effect].id}lightStaticColor`, true);    
            }
            else {
                toggleElement(`${rewardEffects[effect].id}lightStaticColor`, false);    
            }
        }
    }
}

function setSoundRewardMultiple(soundRewardSelect) {
    let soundRewardMultiple = document.getElementById(`${soundRewardSelect}MultiCheckbox`).checked;
    let soundReward = document.getElementById(soundRewardSelect);
    if(soundRewardMultiple) {
        // enable multiple
        // console.log(`${soundRewardSelect} multi checked`);
        // console.log(soundReward);
        document.getElementById(soundRewardSelect).multiple = true;

    }
    else {
        // console.log(`${soundRewardSelect} multi unchecked`);        
        // console.log(soundReward);
        document.getElementById(soundRewardSelect).multiple = false;        
        // disable multiple and default to none
    }
}

// hue
async function hueControls(lightID, command, enabled) {
    const hueSettings = await getHueSettings;
    let sendCommand = {
        lightID: lightID,
        command: command,
        enabled: enabled,
        bridgeIP: hueSettings.bridgeIP,
        username: hueSettings.username
    };
    ipc.invoke('hueControls', sendCommand);
}

async function setHueSettings(setting, newValue) {
    let sendMsg = {
        command: 'setHueSetting',
        setting: setting,
        newValue: newValue
    };
    let response = await ipc.invoke('hueSettings', sendMsg);
    return response;
}

async function getHueSettings() {
    let sendMsg = { command: 'getHueSettings' };
    let response = await ipc.invoke('hueSettings', sendMsg);
    return response.hueSettings;
}

async function getAllLights() { 
    let response = await ipc.invoke('getAllLights');
    if(response) {
        return response.hueLights;
    }
    else {
        return false;
    }
}

async function saveHueBridgeIP() {
    let newBridgeIP = document.getElementById('hueBridgeIP').value;    
    if(newBridgeIP.length > 7) { // it's an IP - "0.0.0.0" is 7 characters
        const result = await setHueSettings('bridgeIP', newBridgeIP);
        if(result.success) {
            // updateStatus('success', `Saved HUE bridge IP ${newBridgeIP} to HUE settings.`);
            showPage('pointsHue');
        }
    }
}

async function createHueBridgeUser() {
    let sendMsg = { command: 'createUser' };    
    let response = await ipc.invoke('hueSettings', sendMsg);
    if(response.success) {
        showPage('pointsHue');
        document.getElementById('hueBridgeConnectSetttings').style.display = 'none';
    }
    else {
        if(response.message.includes('link button not pressed')) {
            document.getElementById('hueBridgeCreateUserMsg').innerHTML = 'Press link button on bridge and try again';
        }
    }    
}

async function updateHueAlertsSettings(alertType, newAlertsSettings) {
    let sendMsg = {
        type: alertType,
        newSettings: newAlertsSettings
    };
    ipc.invoke('setHueAlertsSettings', sendMsg);
}

async function getHueAlertsSettings(alertType) {
    const result = await ipc.invoke('getHueAlertsSettings', alertType);
    return result;
}

async function saveHueSettings() {
    // read lights
    let lightsEnabled = document.getElementsByName('lightRewardEnabled');
    let channelPointsAlertSettings = {};
    // console.log(lightsEnabled);
    for(let x = 0; x < lightsEnabled.length; x++) {
        let lightID = lightsEnabled[x].id;
        if(lightsEnabled[x].checked) {
            channelPointsAlertSettings[lightID] = true;
            // console.log(`Light ID ${lightID} enabled`);
        }
        else {
            channelPointsAlertSettings[lightID] = false;
            // console.log(`Light ID ${lightID} disabled`);
        }
    }
    // console.log(channelPointsAlertSettings);
    await updateHueAlertsSettings('channelPointsLights', channelPointsAlertSettings);    
    
    // read rewards
    let lightRewards = document.getElementsByName('hueRewards');
    let channelPointsLightRewards = {};
    // console.log(lightRewards);    
    for(let y = 0; y < lightRewards.length; y++) {
        if(lightRewards[y].value.toLowerCase() != 'none') {
            let rewardName = lightRewards[y].id;
            channelPointsLightRewards[rewardName] = {
                name: rewardName,
                effect: lightRewards[y].value
            }
            if(lightRewards[y].value == 'staticColor') {
                let staticColorSetting = document.getElementById(`${rewardName}rewardEffectlightStaticColor`).value;
                channelPointsLightRewards[rewardName].color = staticColorSetting;
            }
        }
    }
    // console.log(channelPointsLightRewards);
    await updateHueAlertsSettings('channelPointsRewards', channelPointsLightRewards);
    alertMsg(true, 'success', 'Hue settings updated');
    showPage('pointsHue');
}
