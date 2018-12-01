#!/bin/bash

WS_URL='wss://localhost:9090'

if [ ! -z "$ROSBRIDGE_URL" ]; then
    WS_URL='wss://'${ROSBRIDGE_URL##*/}
fi

# write env object to env.js
cat <<EOT > /drone_vel_ui/src/env.js
export const WS_URL = '${WS_URL}';
EOT
