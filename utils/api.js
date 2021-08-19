const fetch = require('node-fetch');

// change this to get/post
async function twitchAPI(url, clientId, token) {
    let result = await fetch(url, {method: 'get', headers: {'Client-ID': clientId, 'Authorization': `Bearer ${token}`}});
    result = await result.json();
    return result;
}

async function createStreamMarker(channelId, clientId, token, description) { 
    let url = 'https://api.twitch.tv/helix/streams/markers';
    const result = await fetch(url, {method: 'post', headers: {'Client-ID': clientId, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: `{"user_id":"${channelId}", "description":"${description}"}`});
    const response = await result.json();
    let returnResult = {};
    if(response.error !== undefined) {
        returnResult = {
            result: false,
            status: response.status,
            message: response.message,
            id: null,
            created_at: null,
            description: null,
            position_seconds: null
        }
    }   
    if(response.data !== undefined) {
        const data = response.data[0];
        returnResult = {
            result: true,
            status: null,
            message: null,
            id: data.id,
            created_at: data.created_at,
            description: data.description,
            position_seconds: data.position_seconds
        }
    }
    return returnResult;
}

async function getChannelID(channelName, clientId, token) {
    let url = `https://api.twitch.tv/helix/users?login=${channelName}`;
    result = await twitchAPI(url, clientId, token)
    .catch(error => {console.log(`Twitch API erorr: ${error}`);});
    if(result.data.length > 0 && 'id' in result.data[0]) {
        return result.data[0].id;
    }
    else {
        return false;
    }
}

async function getCurrentGame(channelID, clientId, token) {
    // this uses API v5 because helix does not show game when stream is offline
    let url = `https://api.twitch.tv/kraken/channels/${channelID}`;
    let result = await fetch(url, {method: 'get', headers: {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': clientId, 'Authorization': `OAuth ${token}`}});
    result = await result.json();
    if('game' in result) {
        return result.game;
    }
    else {
        return false;
    }
}

async function getStreamTitle(channelID, clientId, token) {
    // this uses API v5 because helix does not show game when stream is offline
    let url = `https://api.twitch.tv/kraken/channels/${channelID}`;
    let result = await fetch(url, {method: 'get', headers: {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': clientId, 'Authorization': `OAuth ${token}`}});
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

async function runAd(channelId, clientId, token, adLength) {
    let url = 'https://api.twitch.tv/helix/channels/commercial';
    const result = await fetch(url, {method: 'post', headers: {'Client-ID': clientId, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: `{"broadcaster_id":"${channelId}", "length":${adLength}}`});
    const response = await result.json();
    let returnResult = {};
    if(response.message !== undefined && response.message.length > 1) {
        returnResult = {
            result: false,
            adLength: response.message["length"],
            message: response.message
        }
    }
    else {
        const responseData = response.data[0];
        returnResult = {
            result: true,
            adLength: responseData["length"],
            retry_after: responseData.retry_after
        }
    }
    return returnResult;
}   

async function getTwitchUserInfo(userId, clientId, token) {
    let url = `https://api.twitch.tv/helix/users?id=${userId}`;
    const result = await twitchAPI(url, clientId, token);
    return result.data;
}

async function getChannelRewards(channelName, clientId, token) {
    let channelId = await getChannelID(channelName, clientId, token);
    let url = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channelId}`;
    const result = await twitchAPI(url, clientId, token); 
    return result;
}

module.exports.getChannelID = getChannelID;
module.exports.getCurrentGame = getCurrentGame;
module.exports.getStreamTitle = getStreamTitle;
module.exports.createStreamMarker = createStreamMarker;
module.exports.runAd = runAd;
module.exports.getChannelRewards = getChannelRewards;
module.exports.getTwitchUserInfo = getTwitchUserInfo;
