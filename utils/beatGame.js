const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getChannelID, getCurrentGame, createStreamMarker } = require('./api');

async function beatGame(beatComments, beatChannel, beatSpreadSheetID, beatSheetID, clientId, token, googleCredsFile) {        
    const doc = new GoogleSpreadsheet(beatSpreadSheetID);
    await doc.useServiceAccountAuth(require(googleCredsFile));
    await doc.loadInfo();

    let now = new Date();
    let beatTimestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    let beatSheet = await doc.sheetsById[beatSheetID];

    let lookupChannel = beatChannel.substr(1);
    let channelID = await getChannelID(lookupChannel, clientId, token);
    let gameName = await getCurrentGame(channelID, clientId, token);            
    if(gameName) {
        let commentsString = '';        
        let beatMsg = '';
        if(beatComments.length > 0) {
            beatComments.forEach(comment => { commentsString += `${comment} `;});   
            commentsString = commentsString.trim();     
            beatMsg = `Added ${gameName} (${commentsString}) to !list`;    
        }
        else {
            commentsString = '';
            beatMsg = `Added ${gameName} to !list`
        }
        let beatGameArray = [gameName, beatTimestamp, commentsString];
        await beatSheet.addRow(beatGameArray)
        .catch(error => {console.log(error);});
        let channelId = await getChannelID(beatChannel.substr(1), clientId, token);
        await createStreamMarker(channelId, commentsString, clientId, token);
        return beatMsg;
    }
    else {
        console.log('gameName is empty or does not exist');
    }
}

module.exports.beatGame = beatGame;
