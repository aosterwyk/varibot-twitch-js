#  varibot-twitch-js
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/varixx/varibot-twitch-js?sort=semver) ![GitHub last commit](https://img.shields.io/github/last-commit/varixx/varibot-twitch-js) ![GitHub last commit (branch)](https://img.shields.io/github/last-commit/varixx/varibot-twitch-js/dev?label=last%20commit%20%28dev%29) ![Discord](https://img.shields.io/discord/90687557523771392?color=000000&label=%20&logo=discord) ![Twitch Status](https://img.shields.io/twitch/status/varixx?label=%20&logo=twitch) 

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
- Run ```npm install``` to install dependencies 

## Usage

- Copy botSettings.js.example to botSettings.js in root directory. Update required settings. 
- TO DO - Steps for twitch Client ID and token
- TO DO - Steps for google spreadsheet API access
- TO DO - Sounds and channel points rewards setup
- Start with ```npm start```

## Support
[Discord server](https://discord.gg/QNppY7T) or DM `VariXx#8317`

VariXx on [twitter](https://twitter.com/VariXx) or [github](https://github.com/varixx/). I do not check these two very often.  

## License
[MIT](https://choosealicense.com/licenses/mit/)

