
// https://docs.google.com/spreadsheets/d/<spreadsheet ID>/edit#gid=<worksheet ID>

function getSpreadsheetInfo(url) { 
    let spreadsheetInfo = {};
    if(typeof(url) === 'string') {
        let trimmedSheetUrl = url.replace('https://docs.google.com/spreadsheets/d/', '');
        let splitSheetUrl = trimmedSheetUrl.split(`/`); 
        let spreadsheetId = splitSheetUrl[0];
        let worksheetId = (splitSheetUrl[1]).replace('edit#gid=', '');

        spreadsheetInfo = {
            spreadsheetId: spreadsheetId,
            worksheetId: worksheetId
        };
        return spreadsheetInfo
    }
}

module.exports.getSpreadsheetInfo = getSpreadsheetInfo;
