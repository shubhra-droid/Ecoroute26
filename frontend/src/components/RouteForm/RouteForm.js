import React, { useState } from "react";
import { getRoute } from "../../services/api";

function RouteForm({ setRouteData }) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("car");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!source || !destination) {
      alert("Please enter both source and destination!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getRoute(source, destination, mode);

      if (data.error) {
        setError(data.error);
      } else {
        setRouteData(data);
      }
    } catch (err) {
      setError("Failed to connect to backend. Make sure server is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "30px", textAlign: "center" }}>
      <h2 style={{ color: "#39ff14", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "25px" }}>Enter Route</h2>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
        <input
          type="text"
          placeholder="Enter Source City (e.g. Chennai)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Destination City (e.g. Bangalore)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="car">Car 🚗</option>
          <option value="bike">Bike 🏍️</option>
          <option value="walk">Walk 🚶</option>
          <option value="bus">Bus 🚌</option>
          <option value="metro">Metro 🚇</option>
        </select>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Finding Route..." : "Find Route ⚡"}
        </button>
      </div>

      {error && <p style={{ color: "#ff3939", marginTop: "15px", fontWeight: "bold" }}>{error}</p>}
    </div>
  );
}

export default RouteForm;