
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - [No ETA]
 
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