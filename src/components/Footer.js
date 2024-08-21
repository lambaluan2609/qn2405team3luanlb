import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes } from "@fortawesome/free-solid-svg-icons";

export default class Footer extends Component {
  render() {
    const { user, onLogout } = this.props;

    return (
      <footer className="footer py-4 bg-dark" style={{ position: "relative" }}>
        <div className="container-fluid">
          <div className="row align-items-center justify-content-lg-between">
            <div className="col-12 mb-lg-0">
              <div className="copyright text-center text-sm text-muted text-lg-start">
                Copyright © 2024, made with
                <FontAwesomeIcon className="mx-1" icon={faCubes} />
                by Lam Ba Luan.
                <a
                  href="https://www.facebook.com/scorpius.1202/"
                  rel="noreferrer"
                  className="font-weight-bold text mx-1 text-decoration-none text-white"
                  target="_blank"
                >
                  Lam Ba Luan.
                </a>
              </div>
            </div>
          </div>
        </div>
        {user && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              onClick={onLogout}
              style={{
                backgroundColor: "transparent",
                color: "#6c757d",
                border: "1px solid ",
                borderRadius: "0 4px 4px 0",
                padding: "4px 10px",
                marginRight: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
            <span
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px 0 0 4px",
              }}
            >
              {user.name || "Người dùng"}
            </span>
          </div>
        )}
      </footer>
    );
  }
}
