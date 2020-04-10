const fetch = require('node-fetch');
const botSettings = require('../botSettings.json');

async function getChannel(channelName)
{
    url = `https://api.twitch.tv/helix/users?login=${channelName}`;
    let res = await fetch(url, {method: 'get', headers: {'Client-ID': botSettings.clientID, 'Authorization': `Bearer ${botSettings.password}`}});
    let data = await res.json();
    console.log(JSON.stringify(data));
    return data;
}

async function start()
{
    // the second function is just to print the return and is not needed. the async function must be called (awaited) from another async function. 
    let channelID = await getChannel('varixx');

    console.log(JSON.stringify(channelID));
}

start();
