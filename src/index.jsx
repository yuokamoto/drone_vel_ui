import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as NumericInput from "react-numeric-input";
import {WS_URL, VIDEO_URL} from  "./env.js";
// import WebSocketRTC from "./webrtc.js"
import * as webrtc from "./webrtc.js"

const ROSLIB = require("roslib");

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     rosbridge_url: WS_URL,
     video_url: VIDEO_URL, //+"/stream?topic=/cv_camera/image_raw",
     video_connected: false,
     vel: 0.1,
     ang_vel: 0.36,
     isOn: false,
     isPublish: false,
     textValue: VIDEO_URL,
     ros_msg: new ROSLIB.Message({
            linear : {
             x : 0,
             y : 0,
             z : 0
            },
            angular : {
             x : 0,
             y : 0,
             z : 0
            }
        }),
     ros: null
    };

    this.state.ros = new ROSLIB.Ros({
        url : this.state.rosbridge_url
     })

    this.state.ros.on('connection', function() {
      console.log('Connected to websocket server.');
    });

    this.state.ros.on('error', function(error) {
      console.log('Error connecting to websocket server: ', error);
    });

    this.state.ros.on('close', function() {
      console.log('Connection to websocket server closed.');
      // setTimeout(()=>{this.connect(this.socket.url)},1000)
    });

    this.state.cmd_vel = new ROSLIB.Topic({
        ros : this.state.ros,
        name : '/cmd_vel',
        messageType : 'geometry_msgs/Twist'
    });
    // this.state.mode = new ROSLIB.Topic({
    //     ros : this.state.ros,
    //     name : '/mode',
    //     messageType : 'std_msgs/Int8'
    // });
    // this.state.takeoff = new ROSLIB.Topic({
    //     ros : this.state.ros,
    //     name : '/tello/takeoff',
    //     messageType : 'std_msgs/Empty'
    // });
    // this.state.land = new ROSLIB.Topic({
    //     ros : this.state.ros,
    //     name : '/tello/land',
    //     messageType : 'std_msgs/Empty'
    // });
    // this.state.image = new ROSLIB.Topic({
    //     ros : this.state.ros,
    //     name : '/tello/image_raw/compressed',
    //     messageType : 'sensor_msgs/CompressedImage'
    // });
    // this.state.image.subscribe(message => {
    //     console.log('Received message on : ' + message.data);
    // });
    setInterval(() => {
        if(this.state.isPublish){
          console.log(this.state.ros_msg)
          this.state.cmd_vel.publish(this.state.ros_msg)
      }
    },
    100)

    this.connect = function() {
      if(!this.state.video_connected){ //disconnect
        console.log('Disconnect')
        webrtc.disconnect()
      }
      console.log('Connect to '+ this.state.video_url)
      webrtc.connect(this.state.video_url)
    }

    // setInterval(() => {
    //     if(!this.state.video_connected){
    //       this.connect()
    //       this.state.video_connected = true
    //     }
    // },
    // 1000)
  }

  renderSquare(i, arg) {
    return (
      <button className="square" 
        onMouseDown={ () => this.handleClick(i, arg, true)}
        onMouseUp={ () => this.handleClick(i, arg, false)}
      >
        {i}
      </button>
    );
  }

  handleClick(i, arg, isDown) {
      this.setState({
        isPublish: isDown && this.state.isOn,
        ros_msg: new ROSLIB.Message({
            linear : {
             x : arg[0]*this.state.vel,
             y : arg[1]*this.state.vel,
             z : arg[2]*this.state.vel
            },
            angular : {
             x : 0*arg[3]*this.state.ang_vel,
             y : 0*arg[4]*this.state.ang_vel,
             z : arg[5]*this.state.ang_vel
            }
        })
      })
    // } 
  }

  handleOnOff(e){
    this.setState({isOn: e.target.checked})
  }
  handleVelChange(vel){
    this.setState({vel: vel})
  }
  handleAngvelChange(ang_vel){
    this.setState({ang_vel: ang_vel})
  }
  handleConnect(){
    // this.state.video_connected = false
    this.connect() 
  }
  changeURL(e) {
    this.setState({video_url: e.target.value});
  }

  render() {
    return (
      <div>
        {/*control panel */}

        {/*video stream from tello*/}
        <div className="image">
            
            <div>
                <video id="remote_video" autoPlay ></video>
            </div>
            <div>
              <select id="codec" defaultValue={1} onChange={ ()=> this.handleConnect() }>
                  <option>H264</option>
                  <option value="1">VP8</option>
                  <option>VP9</option>
              </select>
              <button type="button" onClick={()=>this.handleConnect()}>Connect</button>
              </div>
            {/*
            <img src={this.state.video_url+"/stream?topic=/cv_camera/image_raw"} alt="Video from drone"/>
            */}
            <input type="text" value={this.state.video_url} id="name" size="60" onChange={this.changeURL.bind(this)} />
            
        </div>
        <div className="control">
          {/*takeoff/land */}
          <div> 
            <input id='onfoff' type="checkbox" value="on" onChange={ this.handleOnOff.bind(this) }/>
            <label>ON/OFF</label>
          </div>
          <p></p>

          {/* 2D control panel */}
          <div>
            <div className="status">{'Velocity Control'}</div>
            <div className="board-row">
              {this.renderSquare(' ', '')}
              {this.renderSquare('↑', [ 1, 0, 0, 0, 0, 0])}
              {this.renderSquare(' ', '')}
            </div>
            <div className="board-row">
              {this.renderSquare('↶', [ 0, 0, 0, 0, 0, 1])}
              {this.renderSquare('=', [ 0, 0, 0, 0, 0, 0])}
              {this.renderSquare('↷', [ 0, 0, 0, 0, 0,-1])}
            </div>
            <div className="board-row">
              {this.renderSquare(' ', '')}
              {this.renderSquare('↓', [ -1, 0, 0, 0, 0, 0])}
              {this.renderSquare(' ', '')}
            </div>
          </div>
          <p></p>

          {/* vel change */}
          <div>
            {'Linear vel :'}
            {/* <input type="number" name="velinput" value={this.state.vel} onChange={this.handleVelChange.bind(this)} /> */}
            <NumericInput className="velinput" 
              format={ (num) => {return num + ' [m/s]';} }
              value={this.state.vel}
              onChange = {this.handleVelChange.bind(this)}
              step={0.1} precision={1} min={0} max={2}/><br/>
            {'Angular vel :'}
            <NumericInput className="velinput" 
              format={ (num) => {return num + ' [rad/s]';} }
              value={this.state.ang_vel}
              onChange = {this.handleAngvelChange.bind(this)}
              step={0.36} precision={2} min={0} max={3.6}/>
          </div>
        </div>
      </div>
    );
  }
}


class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <ControlPanel />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
