import React, { Component } from 'react';
import Countdown from 'react-countdown';
import './mobile.css';

export default class Summary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundClass: 'bg-success',
            textClass: 'text-white',
        };
        this.onTick = this.onTick.bind(this);
    }
    onTick(time) {
        if (time.hours === 0) {
            if(time.minutes > 2 && time.minutes < 5) {
                this.setState({
                    backgroundClass: 'bg-warning',
                    textClass: 'text-dark'
                });
            } else if(time.minutes < 2) {
                this.setState({
                    backgroundClass: 'bg-danger',
                    textClass: 'text-white'
                });
            }
        }
    }
    render() {
        let timestamp = parseInt(this.props.match.params.timestamp);
        const rendererCountdown = ({ hours, minutes, seconds, completed }) => {
            if (completed) {
                return "00:00:00";
            } else {
                hours = hours < 10 ? "0" + hours : hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                return <span>{hours}:{minutes}:{seconds}</span>;
            }
        };
        return (
            <div className={"full-height-container " + this.state.backgroundClass + " " + this.state.textClass}>
                <div className="container">
                    <div className='row align-items-center min-vh-100'>
                        <div className='col-12 text-center'>
                            <h1>{this.props.match.params.name}!</h1>
                            <div className="cowntdown">
                                <Countdown
                                    date={timestamp}
                                    daysInHours={true}
                                    renderer={rendererCountdown}
                                    onTick={this.onTick} />
                            </div>
                            <p className='card-text'>Minutes until the break ends</p>          
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}