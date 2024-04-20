<div align="center" style="display:grid;place-items:center;">
<p>
    <img width="100" src="./app-icon.png" alt="Statusify Logo">
</p>
<h1>Statusify</h1>

![GitHub release (latest by date)](https://img.shields.io/github/v/release/Orphoros/Statusify?label=latest%20release)

<h4>Discord Rich Presence GUI Application for Window, macOS, and Linux</h4>
</div>

<p align="middle">
    <img src="./img/statusify_v0.0.9_macos_darktheme.png" width="40%" />
    <img src="./img/statusify_v0.0.9_macos_lighttheme.png" width="40%" />
</p>

## About

Statusify is an open source simple and easy-to-use cross platform GUI application for setting up Discord Rich Presence. It allows you to create and customize your own rich presence and preview it in real-time. It is a tiny application that barely uses any disk space.

> [!NOTE]
> Statusify is currently in development and is only available for testing purposes as an alpha release.

## Key Features

- Set up your own custom rich presence.
- Configure the details and state text.
- Set the large and small images and their tooltips.
- Define when the activity starts to display how long you have been doing it.
- Display a party size.
- Add a button with a label and a URL.
- Toggle any of the rich presence elements on and off.
- Save your editor settings, so you don't have to reconfigure it every time you open the app.

## Supported Platforms

Statusify is available for the following platforms:

<p align="left">
    <img src="https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white" />
    <img src="https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white" />
    <img src="https://img.shields.io/badge/Linux-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" />
</p>

Statusify is officially supported and tested on:

- Windows 10
- macOS Sonoma (Apple Silicon)

## Technologies

<p align="left">
    <img src="https://img.shields.io/badge/Tauri-000000?style=for-the-badge&logo=tauri&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/React-1e90ff?style=for-the-badge&logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

### Developer's guide

<details><summary>1. Setup the project</summary>

1. Clone the repository and install the dependencies.

```bash
git clone git@github.com:Orphoros/Statusify.git
```

2. Install the dependencies.

```bash
npm i
```

</details>

<details><summary>2. Run the project</summary>

Run the app in development mode.

```bash
npm run tauri dev
```

</details>

</details>

<details><summary>3. Update dependencies</summary>

1. Fetch new updates from the repository.

```bash
npm run upgrade
```

2. Create the lock file for the new dependencies.

```bash
npm run lock
```

</details>

---

## Disclaimer

> [!WARNING]
> Discord is a trademark of Discord Inc. Statusify is not affiliated with Discord Inc. in any way and is not an official application. Statusify is an open-source project made for educational purposes and is not responsible for any misuse of the application. Use the application at your own risk.
