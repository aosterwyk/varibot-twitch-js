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

Download and run the installer linked in the [latest release](https://github.com/VariXx/varibot-twitch-js/releases) or build/package using the instructions below.

### Packaging  
- Clone the repository 
- Install electron-packager (global recommended)
``npm install -g electron-packager``
- Install dependencies 
``npm install`` 
- Run electron-packager from the project directory 
``electron-packager``

## Usage

See the [settings wiki page](https://github.com/VariXx/varibot-twitch-js/wiki/Settings) for settings details.

### Basic setup
The DB file will not exist on first launch. If the DB file does not exist the bot will start on the settings page.
- Click the **Get Token** button on the top of the settings page. Log into twitch and authorize the bot if prompted. 
- Copy the token on the next site. **Do not share this token with anyone**. This is a password used for the bot to login under your account. 
- Username: Enter your username in the username field. 
- Token: Paste your token from the step above in the token field. 
- Client ID: Enter a client ID (Default: ``rq2a841j8f63fndu5lnbwzwmbzamoy``) for the bot to use. This is tied to the token above. 
- Channel: Enter the channel for the bot to join. This is your username only (ex: varixx) you do not need to add # or enter your full twitch URL. 

## Support
[Discord server](https://discord.gg/QNppY7T) or DM `VariXx#8317`

