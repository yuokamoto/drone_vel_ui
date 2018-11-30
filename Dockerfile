FROM node

# clone source
RUN git clone https://github.com/yuokamoto/drone_vel_ui.git

# install/setup node
RUN cd /drone_vel_ui && npm install

# execute roslaunch and ui
CMD npm start --prefix /drone_vel_ui

# add entrypoint
#ENTRYPOINT ["/bin/bas"]