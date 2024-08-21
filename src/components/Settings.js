import React, { Component } from "react";
import octocatImage from "../images/octocat.png";
import "./settings.css";
import timezones from "./timezones.json";

export default class Settings extends Component {
  constructor(props) {
    super(props);

    const defaultTimezone =
      timezones.find((tz) => tz.label === "Hanoi, Vietnam")?.value ||
      "Asia/Ho_Chi_Minh";

    this.state = {
      currentTime: new Date(),
      defaultBreaks: [
        {
          name: "Duration Break",
          duration: 15,
          icon: "coffee-cup",
          enabled: true,
          selected: false,
          isEditing: false,
          timezones: [defaultTimezone],
          useFixedTime: false,
          fixedTime: "",
        },
        {
          name: "Fixed Time Break",
          duration: 0,
          icon: "burger",
          enabled: true,
          selected: false,
          isEditing: false,
          timezones: [defaultTimezone],
          useFixedTime: true,
          fixedTime: "12:00",
        },
      ],
      editedBreakName: "",
      editedBreakDuration: "",
      editedBreakFixedTime: "12:00",
      editedBreakTimezones: [defaultTimezone],
      timezoneSearch: "",
      showTimezoneList: false,
    };

    this.onClickBreak = this.onClickBreak.bind(this);
    this.onClickStartBreak = this.onClickStartBreak.bind(this);
    this.onClickHistoryPage = this.onClickHistoryPage.bind(this);
    this.handleEditBreak = this.handleEditBreak.bind(this);
    this.handleSaveEdit = this.handleSaveEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
    this.handleTimezoneSearchChange =
      this.handleTimezoneSearchChange.bind(this);
    this.toggleTimezoneList = this.toggleTimezoneList.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 60000);
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  tick() {
    this.setState({
      currentTime: new Date(),
    });
  }

  addMinutesToCurrentDate(minutes, timezone) {
    let newTime = new Date();
    newTime.setMinutes(newTime.getMinutes() + minutes);
    return newTime.toLocaleString("en-US", { timeZone: timezone });
  }

  onClickBreak(index) {
    this.setState((prevState) => {
      const newBreaks = prevState.defaultBreaks.map((item, i) => ({
        ...item,
        selected: i === index,
      }));
      return { defaultBreaks: newBreaks };
    });
  }

  onClickHistoryPage() {
    console.log("jheheahdjkhasdk");
    this.props.history.push(`/history`);
  }

  onClickStartBreak() {
    const selectedBreak = this.state.defaultBreaks.find(
      (item) => item.selected
    );
    if (selectedBreak) {
      let endingTimestamp;
      if (selectedBreak.useFixedTime) {
        const [hours, minutes] = selectedBreak.fixedTime.split(":");
        const now = new Date();
        const end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes
        );
        if (end < now) {
          end.setDate(end.getDate() + 1);
        }
        endingTimestamp = end.getTime();
      } else {
        const newTime = this.addMinutesToCurrentDate(
          selectedBreak.duration,
          selectedBreak.timezones[0]
        );
        endingTimestamp = new Date(newTime).getTime();
      }
      const breakName = selectedBreak.name;

      localStorage.setItem(
        "selectedBreak",
        JSON.stringify({
          name: breakName,
          timestamp: endingTimestamp,
          timezones: selectedBreak.timezones, // Lưu thông tin về timezone
        })
      );

      const timezonesParam = selectedBreak.timezones.join(",");
      const historyStorage = JSON.parse(localStorage.getItem("history")) || [];
      historyStorage.push({
        name: breakName,
        timestamp: endingTimestamp,
        timezones: selectedBreak.timezones,
      });
      localStorage.setItem("history", JSON.stringify(historyStorage));
      this.props.history.push(
        `/summary/${endingTimestamp}/${breakName}?timezones=${timezonesParam}`
      );
    } else {
      alert("Please select a break to start.");
    }
  }

  handleEditBreak(index) {
    const breakToEdit = this.state.defaultBreaks[index];
    this.setState({
      editedBreakName: breakToEdit.name,
      editedBreakDuration: breakToEdit.duration,
      editedBreakFixedTime: breakToEdit.fixedTime,
      editedBreakTimezones: breakToEdit.timezones,
      defaultBreaks: this.state.defaultBreaks.map((item, i) =>
        i === index ? { ...item, isEditing: true } : item
      ),
      showTimezoneList: false,
    });
  }

  handleSaveEdit(index) {
    const {
      editedBreakName,
      editedBreakDuration,
      editedBreakFixedTime,
      editedBreakTimezones,
    } = this.state;
    this.setState({
      defaultBreaks: this.state.defaultBreaks.map((item, i) =>
        i === index
          ? {
              ...item,
              name: editedBreakName,
              duration: parseInt(editedBreakDuration, 10),
              fixedTime: editedBreakFixedTime,
              timezones: editedBreakTimezones,
              isEditing: false,
            }
          : item
      ),
      editedBreakName: "",
      editedBreakDuration: "",
      editedBreakFixedTime: "12:00",
      editedBreakTimezones: [],
    });
  }

  handleChange(event) {
    const { name, value, type, checked } = event.target;
    this.setState({ [name]: type === "checkbox" ? checked : value });
  }

  handleTimezoneChange(event) {
    const { value, checked } = event.target;
    this.setState((prevState) => {
      const editedBreakTimezones = checked
        ? [...prevState.editedBreakTimezones, value]
        : prevState.editedBreakTimezones.filter((tz) => tz !== value);
      return { editedBreakTimezones };
    });
  }

  handleTimezoneSearchChange(event) {
    this.setState({ timezoneSearch: event.target.value });
  }

  handleClickOutside(event) {
    if (this.node && !this.node.contains(event.target)) {
      const editingIndex = this.state.defaultBreaks.findIndex(
        (brk) => brk.isEditing
      );
      if (editingIndex !== -1) {
        this.handleSaveEdit(editingIndex);
      }
      this.setState({ showTimezoneList: false });
    }
  }

  toggleTimezoneList() {
    this.setState((prevState) => ({
      showTimezoneList: !prevState.showTimezoneList,
    }));
  }

  getFilteredTimezones() {
    const { timezoneSearch } = this.state;
    return timezones.filter(
      (tz) =>
        tz.gmt.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
        tz.label.toLowerCase().includes(timezoneSearch.toLowerCase())
    );
  }

  getTimezoneLabel(timezoneValue) {
    const timezone = timezones.find((tz) => tz.value === timezoneValue);
    return timezone ? timezone.label : timezoneValue;
  }

  render() {
    const {
      currentTime,
      defaultBreaks,
      editedBreakName,
      editedBreakDuration,
      editedBreakFixedTime,
      editedBreakTimezones,
      timezoneSearch,
      showTimezoneList,
    } = this.state;
    const currentTimeString = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const filteredTimezones = this.getFilteredTimezones();

    const breaks = defaultBreaks.map((item, index) => {
      const endTime = item.useFixedTime
        ? item.fixedTime
        : this.addMinutesToCurrentDate(item.duration, item.timezones[0]);
      const formattedEndTime = item.useFixedTime
        ? item.fixedTime
        : new Date(endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

      return (
        <div className="col-12 col-md-6 col-lg-4" key={index}>
          <div
            className={`card card-break mb-3 ${
              item.selected ? "selected" : ""
            }`}
            onClick={() => this.onClickBreak(index)}
          >
            <div className="row g-0">
              <div className="col-md-4 break-icon">
                <img
                  src={require(`../images/icons/${item.icon}.png`).default}
                  alt={item.name}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  {item.isEditing ? (
                    <div ref={(node) => (this.node = node)}>
                      <input
                        type="text"
                        name="editedBreakName"
                        value={editedBreakName}
                        onChange={this.handleChange}
                        className="form-control mb-2"
                      />
                      <div className="input-group mb-2">
                        <input
                          type={item.useFixedTime ? "time" : "number"}
                          name={
                            item.useFixedTime
                              ? "editedBreakFixedTime"
                              : "editedBreakDuration"
                          }
                          value={
                            item.useFixedTime
                              ? editedBreakFixedTime
                              : editedBreakDuration
                          }
                          onChange={this.handleChange}
                          className="form-control"
                        />
                      </div>
                      <input
                        type="text"
                        name="timezoneSearch"
                        value={timezoneSearch}
                        onChange={this.handleTimezoneSearchChange}
                        placeholder="Search timezones"
                        className="form-control mb-2"
                        onClick={this.toggleTimezoneList}
                      />
                      {showTimezoneList && (
                        <div className="timezone-list">
                          {filteredTimezones.map((tz, i) => (
                            <div
                              key={i}
                              className={`form-check ${
                                editedBreakTimezones.includes(tz.value)
                                  ? "selected-timezone"
                                  : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`timezone-${i}`}
                                value={tz.value}
                                checked={editedBreakTimezones.includes(
                                  tz.value
                                )}
                                onChange={this.handleTimezoneChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`timezone-${i}`}
                              >
                                {tz.label} (GMT {tz.gmt})
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <h5
                        className="card-title"
                        onClick={() => this.handleEditBreak(index)}
                      >
                        {item.name}
                      </h5>
                      <p
                        className="card-text"
                        onClick={() => this.handleEditBreak(index)}
                      >
                        {item.useFixedTime
                          ? `Fixed Time: ${formattedEndTime}`
                          : `Minute(s): ${item.duration}`}
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          It will end at {formattedEndTime}{" "}
                        </small>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="full-height-container">
        <div className="bg-white text-center octocat-container">
          <img
            src={octocatImage}
            className="img-fluid"
            id="octocat-logo"
            alt="Octocat Logo"
          />
        </div>
        <div className="container py-5">
          <div className="row">
            <div className="col-12 text-white text-center pb-5">
              <h1>It's {currentTimeString}. Time for a break?</h1>
            </div>
          </div>
          <div className="row centered-row text-center pb-5">{breaks}</div>

          <div className="row text-center pb-5">
            <div className="col-12">
              <button
                className="btn btn-light btn-lg mx-1"
                onClick={this.onClickStartBreak}
              >
                Start Break
              </button>
              <button
                className="btn btn-light btn-lg mx-1"
                onClick={this.onClickHistoryPage}
              >
                History Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
