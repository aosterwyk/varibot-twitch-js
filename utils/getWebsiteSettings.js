const fetch = require('node-fetch');

async function getWebsiteSettings() {
    try {
        const result = await(fetch('https://varibot.net/twitch/webSettings.json'));
        const webSettings = await result.json();
        return webSettings;
    }
    catch(error) {
        console.log(error);
        return null;
    }
}

module.exports.getWebsiteSettings = getWebsiteSettings;