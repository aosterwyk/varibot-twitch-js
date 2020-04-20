function randomNumber(max) // this already exists in chatbot
{
  return Math.floor((Math.random() * (max - 0)));
}


async function getOwnedGame(platform)
{
    const botSettings = require('../botSettings.json');
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    const ownedDoc = new GoogleSpreadsheet(botSettings.ownedGamesSpreadSheetID);
    await ownedDoc.useServiceAccountAuth({client_email: botSettings.googleSheetsClientEmail, private_key: botSettings.googleSheetsPrivateKey});
    await ownedDoc.loadInfo();

    // just assume platforms is set for now 
    
    let ownedGamesSheetID = null;

    ownedDoc.sheetsByIndex.forEach(sheet => {
        console.log(sheet.title);
        if(sheet.title.toLowerCase() == platform.toLowerCase())
        {
            ownedGamesSheetID = sheet.sheetId;
            console.log(`Found sheet ${sheet.title}, ID: ${sheet.sheetId}`);
            // make this a function when adding feature to choose a random platform 
        }
    });

    const ownedGamesSheet = ownedDoc.sheetsById[1803592530];
    await ownedGamesSheet.loadCells();
    const ownedGamesSheetRows = await ownedGamesSheet.getRows();
    const randOwnedGamesSheetRow = randomNumber(ownedGamesSheetRows.length);
    let randOwnedGame = await ownedGamesSheet.getCell(randOwnedGamesSheetRow, 0);
    console.log(`${randOwnedGame.value}`);
}

getOwnedGame('genesis (boxed)');
