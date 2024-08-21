import React, { Component } from "react";
import octocatImage from "../images/octocat.png";
import "./settings.css";

export default class HistoryPage extends Component {
  constructor(props) {
    super(props);
    const historyStorage = localStorage.getItem("history");
    const history = historyStorage ? JSON.parse(historyStorage) : [];
    this.state = {
      history,
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(index) {
    this.state.history.splice(index, 1);
    localStorage.setItem("history", JSON.stringify(this.state.history));
    this.setState({ history: this.state.history });
  }

  render() {
    const { history } = this.state;
    console.log("history", history);
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
              <h1>History Page</h1>
            </div>
            <div className="col-12">
              <table class="table text-white">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Timezone</th>
                    <th scope="col">Link</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{item.name}</td>
                      <td>{item.timestamp}</td>
                      <td>{item.timezones.join(", ")}</td>
                      <td>
                        <a
                          href={`${window.location.origin}/summary/${
                            item.timestamp
                          }/${item.name}?timezones=${item.timezones.join(",")}`}
                        >
                          View
                        </a>
                      </td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-danger"
                          onClick={() => this.handleDelete(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
