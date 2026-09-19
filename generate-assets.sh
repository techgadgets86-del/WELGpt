#!/bin/bash
export npm_config_sandbox=false
npm install -D @capacitor/assets
npx @capacitor/assets generate --ios --android
