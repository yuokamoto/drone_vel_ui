FROM node

# clone source
RUN git clone -b jackal_control https://github.com/yuokamoto/drone_vel_ui.git

# install/setup node
RUN cd /drone_vel_ui && npm install


# add entrypoint
COPY env.sh /usr/bin/
ENTRYPOINT /bin/bash -c "bash /usr/bin/env.sh && npm start --prefix /drone_vel_ui"