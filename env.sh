#!/bin/bash

WS_URL='wss://localhost:9090'
VIDEO_URL='http://localhost:8080'

if [ ! -z "$ROSBRIDGE_URL" ]; then
    WS_URL='wss://'${ROSBRIDGE_URL##*/}
fi
if [ ! -z "$VIDEO_URL" ]; then
    WS_URL='http://'${VIDEO_URL##*/}
fi
# write env object to env.js
cat <<EOT > /drone_vel_ui/src/env.js
export const WS_URL = '${WS_URL}';
export const VIDEO_URL = '${VIDEO_URL}';
EOT
