# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
_No unreleased changes_

## [2.1.0] - 2021-09-
### Changed
- Updated readme
- Updated twitch API v5 functions to use v6

### Removed
- Removed old bootstrap css file
- Removed twitch API getGameName function 

## [2.0.0] - 2021-09-01
### Added
- Added ability to read custom channel rewards
- Added user icon to recent events list
- Added window settings config file to use last window size and position on startup 

### Changed 
- Changed bot settings and channel points to use individual settings files (%appdata%\varbot\configs) instead of DB
- Changed template for all pages
- Changed how settings are read and saved from settings pages
- Changed "Sounds" page to "Channel Points" 
- Changed soundboard layout to dynamic sizes and amount of buttons 
- Changed recent events layout
- Changed google creds file load function to use main process instead of remote (deprecated)
- Changed channel point rewards sounds setup. Rewards are now linked to sounds instead of sounds to rewards. Rewards auto-populate and no longer need to be typed in settings page. 

### Removed
- Removed sequelize and sqlite3
- Removed all DB related functions 

### Security 
- Updated google-spreadsheet to 3.1.15 for CVE-2020-28168 (axios)
- Updated electron to 10.2.0 for CVE-2020-26272
- Updated ws to 7.4.6 for CVE-2021-32640

## [1.2.4] - 2021-06-12
### Added
- Added function to save configs to files for upcoming 2.0 changes

### Security
- Updated google-spreadsheet to 3.1.15 for [CVE-2020-28168](https://github.com/advisories/GHSA-4w2v-q235-vp99) (axios)
- Updated ws to 7.4.6 for [CVE-2021-32640](https://github.com/advisories/GHSA-6fc8-4gx4-v693)
- Updated electron to 10.2.0 for [CVE-2020-26272](https://github.com/advisories/GHSA-hvf8-h2qh-37m9)

## [1.2.3] - 2020-11-04
### Security
- Updated electron to 9.3.1 for [CVE-2020-15215](https://github.com/advisories/GHSA-56pc-6jqp-xqj8) 

### Fixed 
- Fixed settings page not populating when starting bot without settings

## [1.2.2] - 2020-09-18
### Security
- Updated node-fetch to 2.6.1 for CVE-2020-15168

## [1.2.1] - 2020-09-10
### Fixed
- Removed worksheet ID from Google Spreadsheets settings for [!beat command issue](https://github.com/VariXx/varibot-twitch-js/issues/12) when using share URLs with different formats. Command will now use first worksheet in spreadsheet. 

## [1.2.0] - 2020-09-03
### Added 
- Added run 90 second ad button
- Added create stream marker button
- Added BRB quick action that creates a stream marker and runs a 90 second ad 
- Added button to upload Google creds file for Google Spreadsheets 

### Changed
- Changed how .mp3 is removed from button label
- Changed Google Spreadsheets settings to read from URL 
- Google creds now load before running Google related commands. Bot does not need to be restarted after updating Google creds file. 

### Fixed
- Fixed stream marker command 
- Bot will give an error message when connecting if token is invalid

### Removed
- Removed reloading sounds when switching to dashboard

## [1.1.1] - 2020-08-28
### Changed
- Sounds reload when switching to home page
- Settings page loads content like other pages 

### Fixed
- Fixed buttons in settings page incorrectly returning to home page 

## [1.1.0] - 2020-08-28
### Added
- Added cards for general and google spreadsheets settings in Settings page
- Added [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) license info
- Added auto update notification messages
- Added play button to sounds in sounds settings page
- Added quick actions and recent cards
- Added play random sound button to quick actions
- Added about page

### Changed
- Changed Google Spreasheets to load creds from file
- Changed functions to load from individual files in utils directory
- Changed changelog to correct formatting for change types 
- Changed window title and electron builder product name
- Changed installer to use electron builder default settings
- Changed Bootstrap theme to [Darkly](https://bootswatch.com/darkly/) 
- Changed button class for hover effect
- Removed .mp3 from sound labels in home
- Changed settings cards titles to headers
- Changed card layouts on home page
- Changed how settings are read and saved on commands settings page

### Fixed
- Fixed clientid not populating if null

### Security
- Updated lodash for CVE-2020-8203

## [1.0.3] - 2020-08-23
- Updated lodash for vulnerabilities

## [1.0.1] - 2020-06-30
### Added
- Added Changelog
- Added setup steps to readme
- Added colors to status messages

### Changed
- Changed status box to card 

## [1.0.0] - 2020-06-25
### Initial Release

[2.1.0]: https://github.com/VariXx/varibot-twitch-js/tree/v2.1.0
[2.0.0]: https://github.com/VariXx/varibot-twitch-js/tree/v2.0.0
[1.2.4]: https://github.com/VariXx/varibot-twitch-js/tree/v1.2.4
[1.2.3]: https://github.com/VariXx/varibot-twitch-js/tree/v1.2.3
[1.2.2]: https://github.com/VariXx/varibot-twitch-js/tree/v1.2.2
[1.2.1]: https://github.com/VariXx/varibot-twitch-js/tree/v1.2.1
[1.2.0]: https://github.com/VariXx/varibot-twitch-js/tree/v1.2.0
[1.1.1]: https://github.com/VariXx/varibot-twitch-js/tree/v1.1.1
[1.1.0]: https://github.com/VariXx/varibot-twitch-js/tree/v1.1.0
[1.0.3]: https://github.com/VariXx/varibot-twitch-js/tree/v1.0.3
[1.0.1]: https://github.com/VariXx/varibot-twitch-js/tree/v1.0.1
[1.0.0]: https://github.com/VariXx/varibot-twitch-js/tree/v1.0.0
[Unreleased]: https://github.com/VariXx/varibot-twitch-js/compare/master...develop
