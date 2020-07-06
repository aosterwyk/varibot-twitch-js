const { getChannelID, getStreamTitle} = require('./api.js');

async function getMultiLink(channel, clientId, token) {
    let channelId = await getChannelID(channel, clientId, token);
    let channelTitle = await getStreamTitle(channelId, clientId, token);
    let multiLink = `https://multistre.am/${channel}/`
    if(channelTitle.includes('!multi') && channelTitle.includes('@')) { 
        let mentionLocation = channelTitle.search('@');
        if(mentionLocation != -1) {
            let multiChannels = channelTitle.slice(mentionLocation);
            multiChannels = multiChannels.trim().split(' ');
            multiChannels.forEach((chan, c) => {
            if(chan.includes('@') && chan.length > 4) {
                multiLink += `${(chan.slice(1)).trim()}/`;
            }
            });
            // client.say(targetChannel,`${multiLink}`);
            return multiLink;
        }
    }
    else { 
        console.log('Topic does not have !multi and @ in title');
    }
}
module.exports.getMultiLink = getMultiLink; 