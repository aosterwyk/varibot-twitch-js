const fetch = require('node-fetch');
const botSettings = require('../botSettings.json');

// change this to get/post
async function twitchAPI(url) {
    let result = await fetch(url, {method: 'get', headers: {'Client-ID': botSettings.clientID, 'Authorization': `Bearer ${botSettings.password}`}});
    result = await result.json();
    return result;
}

async function createStreamMarker(channelId, description) { 
    let url = 'https://api.twitch.tv/helix/streams/markers';
    let result = await fetch(url, {method: 'post', headers: {'Client-ID': botSettings.clientID, 'Authorization': `Bearer ${botSettings.password}`, 'Content-Type': 'application/json'},
    body: `{"user_id":"${channelId}", "description":"${description}"}`
    // varixx 9502699
    });
    
}

async function getChannelID(channelName) {
    let url = `https://api.twitch.tv/helix/users?login=${channelName}`;
    result = await twitchAPI(url)
    .catch(error => {console.log(`Twitch API erorr: ${error}`);});
    if(result.data.length > 0 && 'id' in result.data[0]) {
        return result.data[0].id;
    }
    else {
        return false;
    }
}

async function getCurrentGame(channelID) {
    // this uses API v5 because helix does not show game when stream is offline
    let url = `https://api.twitch.tv/kraken/channels/${channelID}`;
    let result = await fetch(url, {method: 'get', headers: {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': botSettings.clientID, 'Authorization': `OAuth ${botSettings.password}`}});
    result = await result.json();
    if('game' in result) {
        return result.game;
    }
    else {
        return false;
    }
}

async function getStreamTitle(channelID) {
    // this uses API v5 because helix does not show game when stream is offline
    let url = `https://api.twitch.tv/kraken/channels/${channelID}`;
    let result = await fetch(url, {method: 'get', headers: {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': botSettings.clientID, 'Authorization': `OAuth ${botSettings.password}`}});
    result = await result.json();
    if('status' in result) {
        return result.status;
    }
    else {
        return false;
    }
}

async function getGameName(findGameID) {
    // you'll eventually need this for helix because it gives the game ID and not the game name 
    let url = `https://api.twitch.tv/helix/games?id=${findGameID}`;
    result = await twitchAPI(url)
    .catch(error => {console.log(`Twitch API erorr: ${error}`);});
    if(result.data.length > 0 && 'name' in result.data[0]) {
        return result.data[0].name;
    }
    else {
        return false;
    }
}

module.exports.getChannelID = getChannelID;
module.exports.getCurrentGame = getCurrentGame;
module.exports.getStreamTitle = getStreamTitle;
module.exports.createStreamMarker = createStreamMarker;
