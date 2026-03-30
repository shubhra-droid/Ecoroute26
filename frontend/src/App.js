import React, { useState } from "react";
import RouteForm from "./components/RouteForm/RouteForm";
import RouteResult from "./components/RouteResult/RouteResult";
import MapComponent from "./components/MapComponent/MapComponent";
import "./App.css";

function App() {
  const [routeData, setRouteData] = useState(null);

  return (
    <div>
      <header className="header">
        Smart Sustainable Travel Planner
      </header>

      <div className="container">
        <RouteForm setRouteData={setRouteData} />

        {/* The Map Component handles its own null state visually */}
        <MapComponent routeData={routeData} />

        {routeData && <RouteResult routeData={routeData} />}
      </div>

      <footer className="footer">
        EcoRoute © 2006
      </footer>
    </div>
  );
}

export default App;