#  varibot-twitch-js
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/varixx/varibot-twitch-js?sort=semver)](https://github.com/VariXx/varibot-twitch-js/releases) [![GitHub last commit](https://img.shields.io/github/last-commit/varixx/varibot-twitch-js)](https://github.com/VariXx/varibot-twitch-js/commits/master) [![GitHub last commit (branch)](https://img.shields.io/github/last-commit/varixx/varibot-twitch-js/dev?label=last%20commit%20%28dev%29)](https://github.com/VariXx/varibot-twitch-js/commits/dev) [![Discord](https://img.shields.io/discord/90687557523771392?color=000000&label=%20&logo=discord)](https://discord.gg/QNppY7T) [![Twitch Status](https://img.shields.io/twitch/status/varixx?label=%20&logo=twitch)](https://twitch.tv/VariXx) 

VariBot is a twitch chat bot with some custom features that were missing from existing bots. Some features include:
- Updating google spreadsheet of games completed on stream with current game's name and timestamp.
- Choose random game from google spreadsheet.
- Playing sounds for channel points (pubsub) rewards. 
- Choosing a random GTA radio station.
- Listing the GTA timelines based on the game currently being played.
- Automatic !multi command when "!multi" and "@\<useranme\>" are in stream title.

This project was started to learn node. It may eventually be public. If you're reading this it's probably already public and I forgot to update the readme. Please open an issue for that. 

## Installation

- Download or clone the repo.
- Install nodejs v13.12.0 or newer
- Run ```npm install``` to install dependencies 

## Usage

- Copy botSettings.js.example to botSettings.js in root directory. Update required settings. **NOTE**: "password" is your oauth token, not your actual twitch password.
- Leave "password" blank if this is your first time running this bot. The bot will error out with a URL to generate a token when you start it for the first time.
- Copy channelPointsSounds.example.json to channelPointsSounds.json in root directory. Add any sounds for channel rewards. (Note: Command names are case sensitive) 
- TO DO - Steps for google spreadsheet API access
- Start with ```npm start```

## Support
[Discord server](https://discord.gg/QNppY7T) or DM `VariXx#8317`

VariXx on [twitter](https://twitter.com/VariXx) or [github](https://github.com/varixx/). I do not check these two very often.  

## License
[MIT](https://choosealicense.com/licenses/mit/)

