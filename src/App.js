import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Summary from "./components/Summary";
import Mobile from "./components/Mobile";
import HistoryPage from "./components/HistoryPage";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse?.credential);
    console.log(decoded);
    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  const handleLogout = () => {
    console.log("trigger");
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Route exact path="/" component={Home} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/summary/:timestamp/:name" component={Summary} />
      <Route exact path="/mobile/:timestamp/:name" component={Mobile} />
      <Route exact path="/history" component={HistoryPage} />

      {!user && (
        <GoogleLogin
          clientId="690556535195-ok43dhkn13ef9hjp3o80std2hj3fo3gb.apps.googleusercontent.com"
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      )}
    </Layout>
  );
}

export default App;
