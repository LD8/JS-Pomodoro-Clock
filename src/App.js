import React from "react";
import "./App.scss";

class IncDecButton extends React.Component {
  render() {
    return (
      <div className="inc-dec">
        <h2 id={this.props.labelID}>{this.props.label}</h2>
        <button
          value="+"
          id={this.props.incButtonID}
          onClick={this.props.onClick}
        >
          Increase
        </button>
        <h1 id={this.props.breakLengthID}>{this.props.breakLength}</h1>
        <button
          value="-"
          id={this.props.decButtonID}
          onClick={this.props.onClick}
        >
          Decrease
        </button>
      </div>
    );
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timer: 1500,
      timerState: false,
      timerType: "Session",
      tick: "" // why do we need an intervalID ??
    };
  }

  incDec = (value, duration, stateKey, timerType) => {
    if (this.state.timerState === true) {
      return;
    }
    value === "+" && duration !== 60
      ? this.setState({
          [stateKey]: duration + 1, //NOTE: variable as property name in setState has to be square braketed!!!
          //otherwise it will be recognized as a regular key
          timer:
            timerType === "Session" ? this.state.timer + 60 : this.state.timer
        })
      : value === "-" && duration !== 1
      ? this.setState({
          [stateKey]: duration - 1,
          timer:
            timerType === "Session" ? this.state.timer - 60 : this.state.timer
        })
      : this.setState({ xLength: duration });
  };

  handleBreakInDec = e => {
    this.incDec(e.target.value, this.state.breakLength, "breakLength");
  };

  handleSessionInDec = e => {
    this.incDec(
      e.target.value,
      this.state.sessionLength,
      "sessionLength",
      "Session"
    );
  };

  handleStarp = () => {
    if (!this.state.timerState) {
      this.startCountDown(); //to start the countdown
      this.setState({ timerState: true });
    } else {
      clearInterval(this.state.tick); // to pause the countdown
      this.setState({ timerState: false });
    }
  };

  startCountDown = () => {
    this.setState({
      tick: setInterval(() => {
        if (this.state.timer > 0) {
          this.setState({ timer: this.state.timer - 1 }); // why do we need an intervalID ?? -- tick, because its a tracker/function which should be kept in track within a class
          console.log(this.state.tick);
        } else if (this.state.timer === 0) {
          this.audioBeep.play(); //to play the audio
          this.switchTimerType(); //to switch between break and session time
        }
      }, 1000)
    });
  };

  switchTimerType = () => {
    if (this.state.timerType === "Session") {
      this.setState({
        timerType: "Break",
        timer: this.state.breakLength * 60
      });
    } else if (this.state.timerType === "Break")
      this.setState({
        timerType: "Session",
        timer: this.state.sessionLength * 60
      });
  };

  handleReset = e => {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timer: 1500,
      timerState: false,
      timerType: "Session",
      tick: ""
    });
    clearInterval(this.state.tick);
    this.audioBeep.pause(); //<audio> tag research and understand it
    this.audioBeep.currentTime = 0; //<audio> tag research and understand it
  };

  clockify = a => {
    let m = Math.floor(a / 60);
    let s = Math.floor(a % 60);
    m = m > 9 ? m : "0" + m;
    s = s > 9 ? s : "0" + s;
    return m + ":" + s;
  };

  render() {
    return (
      <div className="container">
        <h2 className="title">Pomodoro Clock</h2>
        <section className="ajustPanel">
          <IncDecButton
            labelID="break-label"
            label="Break Length"
            incButtonID="break-increment"
            breakLengthID="break-length"
            breakLength={this.state.breakLength}
            decButtonID="break-decrement"
            onClick={this.handleBreakInDec}
          />
          <IncDecButton
            labelID="session-label"
            label="Session Length"
            incButtonID="session-increment"
            breakLengthID="session-length"
            breakLength={this.state.sessionLength}
            decButtonID="session-decrement"
            onClick={this.handleSessionInDec}
          />
        </section>
        <section className="timerControl">
          <div className="timer">
            <h1 id="timer-label">{this.state.timerType}</h1>
            <h1 id="time-left">{this.clockify(this.state.timer)}</h1>
          </div>
          <div className="control">
            <button id="start_stop" onClick={this.handleStarp}>
              Play/Pause
            </button>
            <button id="reset" onClick={this.handleReset}>
              Reset
            </button>
          </div>
          <audio //have to understand and remember all these
            preload="auto"
            src="https://goo.gl/65cBl1"
            ref={audio => {
              this.audioBeep = audio;
            }}
            id="beep"
          />
        </section>
      </div>
    );
  }
}

export default Clock;
