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

async function getStreamInfo(channelId, clientId, token) {
    let url = `https://api.twitch.tv/helix/streams?user_id=${channelId}`;
    const result = await twitchAPI(url, clientId, token)
    // console.log(result.data);
    return result.data[0];
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

async function updateChannelPointRedemption(redemptionId, channelId, rewardId, clientId, token, newStatus) {
    let url = `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${channelId}&reward_id=${rewardId}&id=${redemptionId}`;
    const result = await fetch(url, {method: 'PATCH', headers: {'Client-ID': clientId, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: `{"status":"${newStatus}"}`});   
    // Can be either FULFILLED or CANCELED. Updating to CANCELED will refund the user their Channel Points.
    return result;
}

module.exports.getChannelID = getChannelID;
module.exports.createStreamMarker = createStreamMarker;
module.exports.runAd = runAd;
module.exports.getChannelRewards = getChannelRewards;
module.exports.getTwitchUserInfo = getTwitchUserInfo;
module.exports.updateChannelPointRedemption = updateChannelPointRedemption;
module.exports.getStreamInfo = getStreamInfo;