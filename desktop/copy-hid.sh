#!/usr/bin/env bash

# MacOS
cp ./hid/darwin.HID.node    ./../build-desktop/Tronscan-darwin-x64/Tronscan.app/Contents/MacOS/HID.node || true

# Linux
mkdir -p                    ./../build-desktop/Tronscan-linux-x64/resources/app/build || true
cp ./hid/linux.HID.node     ./../build-desktop/Tronscan-linux-x64/resources/app/build/HID.node || true

# Windows
mkdir                       ./../build-desktop/Tronscan-win32-x64/resources/app/build || true
cp ./hid/win.HID.node       ./../build-desktop/Tronscan-win32-x64/resources/app/build/HID.node || true
