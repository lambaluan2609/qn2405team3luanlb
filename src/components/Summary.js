import React, { Component } from "react";
import QRCode from "react-qr-code";
import Countdown from "react-countdown";
import "./summary.css";
import timezones from "./timezones.json"; // Import timezones

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breakDetails: JSON.parse(localStorage.getItem("selectedBreak")) || null, // Fetch break details from local storage
      timezones: [], // Thêm state cho timezones
    };
  }

  componentDidMount() {
    // Lấy thông tin timezone từ URL
    const urlParams = new URLSearchParams(this.props.location.search);
    const timezonesParam = urlParams.get("timezones");
    const timezones = timezonesParam ? timezonesParam.split(",") : [];
    this.setState({ timezones });
  }

  calcolateTimeDifferentTimezone(timestamp, timeZone) {
    return new Date(timestamp).toLocaleString("en-US", {
      timeZone: timeZone,
      timeZoneName: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  generateQRCodeUrl(timestamp, name) {
    const timezonesParam = this.state.timezones.join(",");
    return `${window.location.protocol}//${window.location.host}/mobile/${timestamp}/${name}?timezones=${timezonesParam}`;
  }

  getTimezoneLabelAndGMT(timezoneValue) {
    const timezone = timezones.find((tz) => tz.value === timezoneValue);
    return timezone ? `${timezone.label} (GMT ${timezone.gmt})` : timezoneValue;
  }

  openSettingsTab() {
    window.open(
      `${window.location.protocol}//${window.location.host}/settings`,
      "_blank"
    );
  }

  render() {
    let timestamp = parseInt(this.props.match.params.timestamp);
    const { timezones } = this.state;

    const rendererCountdown = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        return <span className="text-danger">00:00:00</span>;
      } else {
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        let style = "text-white";
        if (hours === 0) {
          if (minutes > 2 && minutes < 5) {
            style = "text-warning";
          } else if (minutes < 2) {
            style = "text-danger";
          }
        }
        return (
          <span className={style}>
            {hours}:{minutes}:{seconds}
          </span>
        );
      }
    };

    return (
      <div className="full-height-container background-container py-5">
        <div className="container">
          <div className="row row-eq-height">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card card-countdown">
                <div className="card-body text-center">
                  <h5 className="card-title">
                    {this.props.match.params.name}!
                  </h5>
                  <div className="cowntdown">
                    <Countdown
                      date={timestamp}
                      daysInHours={true}
                      renderer={rendererCountdown}
                    />
                  </div>
                  <p className="card-text">Minutes until the break ends</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card card-qrcode">
                <div className="card-body text-center">
                  <h5 className="card-title pb-3">Scan Me!</h5>
                  <div className="bg-white py-5">
                    <QRCode
                      bgColor="#FFFFFF"
                      fgColor="#212529"
                      value={this.generateQRCodeUrl(
                        timestamp,
                        this.props.match.params.name
                      )}
                    />
                  </div>
                  <p className="card-text pt-3">
                    Scan this QR code with your smartphone to get a mobile timer
                    page
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card card-custom">
                <div className="card-body">
                  <h5 className="card-title pb-3">Class will resume at:</h5>
                  {timezones.map((timezone, index) => (
                    <p className="card-text" key={index}>
                      <strong>
                        {this.calcolateTimeDifferentTimezone(
                          timestamp,
                          timezone
                        )}{" "}
                      </strong>
                      <br /> {this.getTimezoneLabelAndGMT(timezone)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <button
                className="btn btn-primary btn-go-to-settings"
                onClick={() => this.openSettingsTab()}
              >
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
