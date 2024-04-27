# Change Log

All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - [No ETA]

### Added

- System tray with option to stop the rich presence
- The app closes to the system tray on close instead of exiting the app on Windows and Linux

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