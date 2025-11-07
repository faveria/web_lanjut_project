# Hyyume Mobile (React Native + Expo)

A minimal mobile app that connects to the same VPS backend as the website.

## Prerequisites
- Node.js 18+
- Expo CLI: `npm i -g expo`
- iOS Simulator (Xcode) or Android Emulator (Android Studio), or Expo Go on a device

## Setup
1. Create an `.env` file at the project root with:
   
   ```bash
   EXPO_PUBLIC_API_BASE_URL=https://api.hyyyume.my.id/api
   # Optional MQTT WS URL (enable later if needed)
   # EXPO_PUBLIC_MQTT_WS_URL=wss://api.hyyyume.my.id/mqtt
   ```

2. Install deps and run:
   
   ```bash
   npm install
   npx expo start --clear
   ```

3. Launch on simulator/device from the Expo Dev Tools.

## Notes
- Auth and API endpoints mirror the web app. Token is stored securely via SecureStore.
- Sensor data uses polling (same as web `useSensorData`).
- You can later enable MQTT over WebSocket by providing `EXPO_PUBLIC_MQTT_WS_URL` and adding a mobile-compatible MQTT client.



