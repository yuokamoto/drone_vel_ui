FROM rrdockerhub/ros-base-kinetic-amd64

LABEL authors = "Yu Okamoto <yu.okamoto@rapyuta-robotics.com>"

ENV ROS_HOME=/catkin_ws

# install base software
RUN apt-get update && apt-get install --no-install-recommends -y \
    git \
    ros-kinetic-rosbridge-server \
    nodejs \
    npm \
    curl

# clone source
RUN git clone https://github.com/yuokamoto/drone_vel_ui.git

# install/setup node
RUN ln -s `which nodejs` /usr/bin/node
RUN npm install -g n && n 11.0.0 && npm i -g npm@6.4.1
RUN cd /drone_vel_ui && npm install

# execute roslaunch and ui
RUN cp /drone_vel_ui/start.sh .
CMD ["/start.sh"]

# add entrypoint
ENTRYPOINT ["/ros_entrypoint.sh"]