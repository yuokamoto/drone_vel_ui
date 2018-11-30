#!/bin/bash
set -e

ROSBRIDGE_URL='wss://localhost:9090'

if [ ! -z "$ROSBRIDGE_URL" ]; then
    ROSBRIDGE_URL='wss://'${ROSBRIDGE_URL##*/}
fi

# setup ros environment
source "/opt/ros/$ROS_DISTRO/setup.bash"
exec $@