import React, { Component } from "react";
import Footer from "./Footer";

export class Layout extends Component {
  render() {
    const { user, onLogout } = this.props;

    return (
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div className="container-fluid px-0" style={{ flex: 1 }}>
          <div className="row mx-0">
            <div className="col-12 px-0 bg-gloss-gray-900">
              {this.props.children}
            </div>
          </div>
        </div>
        <Footer user={user} onLogout={onLogout} />
      </div>
    );
  }
}
