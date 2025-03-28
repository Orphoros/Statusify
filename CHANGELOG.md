# Change Log

All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.0.16] - 2025-03-28

### Added

- Settings to change the app's theme (light, dark, and system)
- Custom right-click menu to better suit the app's theme

### Fixed

- Removed the empty space on the right side of the title bar on macOS
- Added padding to the title bar on Windows
- Fixed error handling for text length for the details and state fields

### Changed

- Improved the party size number input

## [0.0.15] - 2024-09-12

### Added

- New custom blue title bar
- DMG installer has a new background image
- Log level can be changed in the launch config

### Changed

- Locale flags are now the same static icon for consistency
- The entire loading and error screens are movable
- Settings are grouped up in a new settings dropdown menu

### Removed

- App ID length is no longer validated to future-proof the app

## [0.0.14] - 2024-08-04

### Fixed

- Fixed a bug where the locales are not correctly loaded on Windows


## [0.0.13] - 2024-08-04

### Added

- The app is localized in English, Dutch, and Hungarian
- Option to launch the app on system startup
- Load and save rich presence settings

### Fixed

- App supports new, 19 character long Discord application IDs


## [0.0.12] - 2024-05-19

### Fixed

- CSP allows the loading of images from URLs
- RPC not being able to start when when button 2 is not set

## [0.0.11] - 2024-05-18

### Added

- Secondary button
- URL images are now previewed in the app

### Changed

- Images URLs or names are now limited to 255 characters

### Fixed

- Allow only a single instance of the app to run to avoid multiple system tray icons
- Image previews correctly load in on app start and no more black boxes are shown

## [0.0.10] - 2024-05-03

### Added

- System tray with option to stop the rich presence
- The app closes to the system tray on close instead of exiting the app on Windows and Linux
- Context menu to input fields
- General context menu to the app

### Changed

- The time picker is now more consistent to the design of the app

## [0.0.9] - 2024-04-20

### Added

- Option to automatically start the rich presence when the app is launched

### Fixed

- Switching between the light and dark theme while the app is running works again

## [0.0.8] - 2024-03-15

### Added

- Defined priority, section, and changelog for the Debian package

### Fixed

- The main app window no longer flickers when the app is launched on Windows
- Resizing the app no longer causes the main window to flicker on Windows

## [0.0.7] - 2024-02-25

### Added

- New memory allocation (mimalloc) to improve RAM usage

### Fixed

- Party size can no longer be less than one
- App no longer uses a lot of memory and CPU
- Start activity button is now disabled when any of the form inputs are invalid

## [0.0.6] - 2024-02-23

### Added

- New window vibrancy (blurred transparency) design for macOS to allow for a more native and modern look
- New simplified design for Linux and Windows

### Fixed

- Make the white splashing and window spawning bugs on load less noticeable

## [0.0.5] - 2024-02-10

### Fixed

- App ID input field height is now static and does not move when the error message is shown
- Removed automatic client detection to save resources
- Text overflow in the preview is now hidden with an ellipsis
- Add image rule to CSP to allow images to be loaded
 
## [0.0.4] - 2024-02-07
 
### Added

- Delay to show window to avoid white splash
- CSP security header
- Print version in logs
 
### Changed

- Client detection is now sent in events instead of running a command from the frontend
- Input fields are smaller to make the app more compact
 
### Fixed
 
- Input clear button now works again
 
## [0.0.3] - 2024-02-01
 
### Changed
  
- All input fields have the same style

### Fixed
 
- The time selection button on Windows is no longer buggy
 
## [0.0.2] - 2023-08-25
 
### Added

- Window size and position are now saved and will be restored once the app is relaunched
- The current active rich presence configs are now saved to disk and are always restored
- Add a loading screen
 
### Fixed
 
- Clicking on the close button on macOS now no longer exists the app, but instead only hides it
- Fixed input error messages not fitting well in a smaller app size