const { getBotSettings } = require('./utils/config/getBotSettings');
const { setBotSettings } = require('./utils/config/setBotSettings');
const botSettingsFilePath = './botSettings.json';

async function testRead() {
    let botset = await getBotSettings(botSettingsFilePath);
    for(let key in botset) { 
        console.log(typeof(botset[key]));
        if(Array.isArray(botset[key])) {
            console.log(`is array`);
        }
    }
}

async function testWrite() {
    let writeThis = {
        name: 'John Smith',
        two: 'second',
        array: ['one', 'two']
    };
    await setBotSettings(botSettingsFilePath, writeThis);
}

testRead();
// testWrite();
