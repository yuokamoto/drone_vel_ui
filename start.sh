#!/bin/bash

roslaunch rosbridge_server rosbridge_websocket.launch &
npm start --prefix /drone_vel_ui