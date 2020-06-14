#  varibot-twitch-js
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/varixx/varibot-twitch-js?sort=semver)](https://github.com/VariXx/varibot-twitch-js/releases) [![GitHub last commit](https://img.shields.io/github/last-commit/varixx/varibot-twitch-js)](https://github.com/VariXx/varibot-twitch-js/commits/master) [![GitHub last commit (branch)](https://img.shields.io/github/last-commit/varixx/varibot-twitch-js/dev?label=last%20commit%20%28dev%29)](https://github.com/VariXx/varibot-twitch-js/commits/dev) [![Discord](https://img.shields.io/discord/90687557523771392?color=000000&label=%20&logo=discord)](https://discord.gg/QNppY7T) [![Twitch Status](https://img.shields.io/twitch/status/varixx?label=%20&logo=twitch)](https://twitch.tv/VariXx) 

<img src="https://acceptdefaults.com/varibot-twitch-js/varibot.png" align="right" />

VariBot is a twitch chat bot with some custom features that were missing from existing bots. Some features include:
- Updating google spreadsheet of games completed on stream with current game's name and timestamp.
- Choose random game from google spreadsheet.
- Playing sounds for channel points (pubsub) rewards. 
- Choosing a random GTA radio station.
- Listing the GTA timelines based on the game currently being played.
- Automatic !multi command when "!multi" and "@\<useranme\>" are in stream title.

This project was started to learn node. It may eventually be public. If you're reading this it's probably already public and I forgot to update the readme. Please open an issue for that. 

## Installation

- [Download](https://github.com/VariXx/varibot-twitch-js/releases) or clone the repo.
- Install [nodejs](https://nodejs.org/en/download/) v13.12.0 or newer
- Copy [mplayer](http://www.mplayerhq.hu/design7/dload.html) to ```%appdata%\npm```
- Run ```npm install``` to install dependencies 

## Usage
- Copy botSettings.js.example to botSettings.js in root directory. Update required settings (see below).
- Copy enabledCommands.json.example to enabledCommands.json. Change any commands you want to disable to false.
- Copy channelPointsSounds.json.example to channelPointsSounds.json in root directory. Add any sounds for channel rewards. Names must match the reward name on the manage rewards page in your dashboard (```https://dashboard.twitch.tv/u/<username>/community/channel-points/rewards```).
- Create a reward called ```Random sound``` to play a random sound in the sounds directory that is not listed in the channelPointsSounds.json file. 
- Enable/disable any commands in enabledCommands.json. 
- Optional: TO DO - Steps for google spreadsheet API access
- Start with ```npm start``` or run ```bot.bat```

### botSettings.json 
- **username**: Username used by the bot.
- **password**: OAuth token for bot. **DO NOT USE YOUR TWITCH ACCOUNT PASSWORD!** If you leave this blank the bot will error out and give a URL to generate an oauth token.
- **clientID**: Client ID used by the bot. The default client ID can be used if you do not have your own.
- **channel**: Channel to join.
- **cooldown**: Global command cooldown in seconds. 
- **soundsDir**: Directory to use for sounds. Any sounds not defined in static sounds (see channelPointsSounds.json) will be used for Random sounds chanenl points reward.
- **googleSheetsClientEmail**: Service account email address for Google Spreasheets. Used for !beat and !shuffle commands
- **googleSheetsPrivateKey**: Service account private key. Used for !beat and !shuffle commands
- **beatSheetID**: Spreadsheet sheet (tab) ID for completed games spreadsheet. Used by !beat command.
- **beatSpreadSheetID**: Spreadsheet ID for completed games spreadsheet. Used by !beat command.
- **beatGameSound**: Sound to be played after running !beat command. 
- **ownedGamesSpreadSheetID**: Spreadsheet ID for owned games list. Used by !shuffle command. 

## Support
[Discord server](https://discord.gg/QNppY7T) or DM `VariXx#8317`

## License
[MIT](https://choosealicense.com/licenses/mit/)

