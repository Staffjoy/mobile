# Staffjoy V1 Mobile Apps for Android and iPhone

[![Moonlight contractors](https://img.shields.io/badge/contractors-1147-brightgreen.svg)](https://moonlightwork.com/for/staffjoy)

[Staffjoy is shutting down](https://blog.staffjoy.com/staffjoy-is-shutting-down-39f7b5d66ef6#.ldsdqb1kp), so we are open-sourcing our code. These applications use [React Native](https://facebook.github.io/react-native/) to create a simple webview around [Staffjoy V1's applications](https://github.com/staffjoy/suite). The mobile applications look for a `mobile-config.json` on the server, which provides a regex for determining which URLs are considered the "app, which hides a navbar with the URL and back button. The repos also includes some other functionality, such as a loading screen and error handling. Thanks to [@JBaller](https://github.com/jballer) for helping us with this last year in his spare time. 

### Example /mobile-config.json

```
{
    hideNavForURLsMatchingPattern: "^https?://(dev|stage|www|suite)\.staffjoy\.com"
}
```


## Background

React Native is packaged as a Node module, delivered via `npm`.

The native projects live in subdirectories, and link to React Native as a local dependency (`npm` puts it into `node_modules/react-native`).

## Setup

1. Install [Homebrew](http://brew.sh/)
1. Install Node (using nvm)
    a. `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash`
    b. `nvm install v5.5.0 && nvm alias default node`
1. `brew install watchman`
1. Install the React Native command line tools
	a. `npm install -g react-native-cli`

## IDEs

IDE installations will handle SDK dependencies

### iOS
- Install [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (v7.3 or newer)
- Install Cocoapods (`gem install cocoapods`)

### Android
Install [Android Studio](developer.android.com/sdk) 2.0 or newer

## Updating Dependencies

**React**: run `npm install` from the project root

> Note: *Skip* the `react-native upgrade` step from the [docs](https://facebook.github.io/react-native/docs/upgrading.html#content). We aren't using their templates, and it would attempt to overwrite important native code.

**iOS**: run `pod install` from the `/ios` directory

**Android**: updated dynamically during the build process


## Debug & Build

> Note: For iOS, because we're using Cocoapods, you **must open the *workspace*** file, (`StaffjoyMobile.xcworkspace`), *not* the project file (`.xcodeproj`).

### Debugging

| Platform | Type |   |
|----------|------|---|
| iOS | Debug | `react-native run-ios` from project root (as of React v0.22, you need a simulator titled "iPhone 6") |
| iOS | Debug | In Xcode: Build and Run the `StaffjoyMobile` target onto a device or simulator |
| Android | Debug | `react-native run-android` while emulator is running or device is connected )

>  While debugging, shake the device to access the React Native Developer menu (`CMD+D` on iOS simulator, `F2` on Android emulator)

#### Loading JavaScript

> Note: Release builds always load from the app binary

| Platform | Notes |
|----------|-------|
| iOS Simulator | Automatically loads latest version via packager |
| iOS Device | Loads from app binary; need to rebuild to get updated JS |
| Android | Loads from server* when `__DEV__` enabled (toggle at top of debug menu after shaking device) |

> \* For Android devices or emulators running Anroid 5 or later, it's easiest to link to the packager over USB by running `adb reverse tcp:8081 tcp:8081`. To link over WiFi, shake the device, tap the last settings option in the debug menu, and enter the address of your machine and port number of packager (default 8081)

### Building

#### iOS

| Target | Properties |
|--------|------------|
| `StaffjoyMobile` | Includes a page for the system's Settings app that allows you to change root domain (i.e. to point at `dev.staffjoy.com`). For realistic testing, deploy to TestFlight and test on a dev server. |
| `Staffjoy Release` | Release build |

1. Open `ios/StaffjoyMobile.xcworkspace` in Xcode
1. Select the desired target
1. Choose `Generic iOS Device` from the device list.
1. Select `Product -> Archive`
1. Once archvied, the Organizer will open (access later via `Window -> Organizer`)
1. Select the latest build, and choose "Upload to App Store"
1. Manage TestFlight and App Store release via [iTunes Connect](https://itunesconnect.apple.com)

> To test an archive on a device without waiting for TestFlight, go to `Window -> Organizer`, choose `Export`, then `Ad Hoc`, and install by dragging the exported file to your device via `Window -> Devices`


#### Android

via shell

1. (One time only) [Set up Gradle variables](https://facebook.github.io/react-native/docs/signed-apk-android.html#setting-up-gradle-variables) for signing with the Staffjoy certificate (credentials are excluded from git for security)
	a. Look up `Android Keystore` in Staffjoy's "Mobile" vault in 1Password
	a. Copy `staffjoy_android_keystore.jks` from 1Password into your project's `android/app` directory
	a. Copy `gradle.properties` into the `~/.gradle` directory
2. Run `./gradlew assembleRelease` (or `installRelease`, `assembleDebug`, `installDebug`)
3. The APK will be built to `android/app/build/outputs/apk/app-release.apk` (or `app-debug.apk`)

Via IDE

1. Open the project in Android Studio
2. Go to `Build -> Generate Signed APK`
3. Choose the `app` module
4. Enter key store info
	a. path: point to a local copy the `.jks` file from 1Password
	b. password: from 1Password
	c. alias: `staffjoy_android_keystore`
	d. key password: the second password from 1Password (under "key info")
5. Choose a destination for the APK
