#!/bin/bash

WS_URL='ws://localhost:9090'
VIDEO_URL='ws://localhost:8080/ws'

if [ ! -z "$ROSBRIDGE_URL" ]; then
    WS_URL='wss://'${ROSBRIDGE_URL##*/}
fi
if [ ! -z "$VIDEO_URL" ]; then
    VIDEO_URL='ws://'${VIDEO_URL##*/}'ws'
fi
# write env object to env.js
cat <<EOT > /drone_vel_ui/src/env.js
export const WS_URL = '${WS_URL}';
export const VIDEO_URL = '${VIDEO_URL}';
EOT
