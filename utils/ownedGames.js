const { GoogleSpreadsheet } = require('google-spreadsheet');

async function getRandomOwnedGame(googleSheetsClientEmail, googleSheetsPrivateKey, spreadSheetId, platform) {
    let findPlatform = platform.toLowerCase();
    let foundSheetId = null;
    let gameResult = false;
    const ownedSheet = new GoogleSpreadsheet(spreadSheetId);    
    try {    
        await ownedSheet.useServiceAccountAuth({client_email: googleSheetsClientEmail, private_key: googleSheetsPrivateKey});
        await ownedSheet.loadInfo();

        for(let s in ownedSheet.sheetsByIndex) {
            if(findPlatform == ownedSheet.sheetsByIndex[s].title.toLowerCase()) { 
                // console.log(`Found ${ownedSheet.sheetsByIndex[s].title} (ID: ${ownedSheet.sheetsByIndex[s].sheetId})`);
                foundSheet = ownedSheet.sheetsByIndex[s];
            }
        }

        if(foundSheet !== null) { 
            const rows = await foundSheet.getRows();
            await foundSheet.loadCells();
            let randomGameId = (Math.floor(Math.random() * (rows.length - 0 + 1) + 0));
            let randomGame = foundSheet.getCellByA1(`A${randomGameId}`);   
            // console.log(randomGame.value);
            gameResult = randomGame.value;
        }
    }
    catch(err) {
        console.log(`Could not open spreadsheet ID ${spreadSheetId} erorr: ${err}`);
    }
    return gameResult;
}

// const botSettings = require('../botSettings.json');


module.exports = { getRandomOwnedGame };