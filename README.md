# PayTrack — Mobile App Setup Guide
### UPI & Bank Transaction Tracker for Android & iOS

---

## What You Need
- A computer (Windows, Mac, or Linux)
- Your Android or iOS phone
- Internet connection

---

## STEP 1 — Install Node.js

1. Go to **https://nodejs.org**
2. Click the big green **"LTS"** button to download
3. Run the installer — click Next → Next → Finish
4. To verify: open **Terminal** (Mac/Linux) or **Command Prompt** (Windows) and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x` ✓

---

## STEP 2 — Install the Expo Go App on Your Phone

- **Android**: Open Play Store → search **"Expo Go"** → Install
- **iPhone**: Open App Store → search **"Expo Go"** → Install

This lets you run the app on your phone instantly without any extra setup.

---

## STEP 3 — Set Up the Project

Open Terminal / Command Prompt and run these commands **one by one**:

```bash
# 1. Go to the paytrack-app folder (adjust path as needed)
cd path/to/paytrack-app

# 2. Install all dependencies
npm install

# 3. Start the development server
npx expo start
```

You'll see a **QR code** appear in the terminal.

---

## STEP 4 — Open on Your Phone

**Android:**
1. Open the **Expo Go** app
2. Tap **"Scan QR Code"**
3. Scan the QR code from your terminal

**iPhone:**
1. Open your phone's default **Camera** app
2. Point it at the QR code
3. Tap the notification that appears → opens in Expo Go

The app will load on your phone in about 30 seconds! 🎉

---

## STEP 5 — Build a Permanent App (Optional)

If you want a proper installable `.apk` (Android) or `.ipa` (iOS) file:

### Free cloud build (easiest):
```bash
# Install EAS CLI
npm install -g eas-cli

# Login / create free Expo account
eas login

# Build for Android (creates .apk you can install directly)
eas build -p android --profile preview

# Build for iOS (requires Apple Developer account)
eas build -p ios
```

The build runs in the cloud — no Android Studio or Xcode needed!
When done, you'll get a download link for the `.apk` file.

### Install the APK on Android:
1. Download the `.apk` to your phone
2. Open it (you may need to allow "Install from unknown sources" in Settings)
3. Tap Install ✓

---

## Features
- 📊 **Dashboard** — Balance overview, recent activity, spending by category
- 📋 **Transactions** — Full history with search & filters, edit categories, delete
- ➕ **Add** — Manually add UPI / NEFT / Bank transactions
- 💬 **Parse SMS** — Paste bank SMS to auto-extract transaction details
- 💡 **Insights** — Source breakdown, category analysis, summary stats
- 💾 **Offline storage** — All data saved locally on your phone (AsyncStorage)

---

## Troubleshooting

**"npx expo start" gives an error:**
→ Make sure you ran `npm install` first inside the `paytrack-app` folder

**QR code doesn't work:**
→ Make sure your phone and computer are on the **same Wi-Fi network**
→ Try pressing `w` in the terminal to open in browser instead

**App shows blank screen:**
→ Shake your phone → tap "Reload"

**Need help?** Visit https://docs.expo.dev or https://forums.expo.dev

---

## Project Structure
```
paytrack-app/
├── app/
│   ├── _layout.jsx          # Root navigation
│   ├── (tabs)/
│   │   ├── _layout.jsx      # Bottom tab bar
│   │   ├── index.jsx        # Dashboard screen
│   │   ├── transactions.jsx # Transactions screen
│   │   ├── add.jsx          # Add transaction screen
│   │   ├── sms.jsx          # Parse SMS screen
│   │   ├── insights.jsx     # Insights screen
│   │   └── src/
│   │       ├── constants.js     # Colors, helpers, SMS parser
│   │       └── useTransactions.js # Data storage hook
├── package.json
├── app.json
└── babel.config.js
```
