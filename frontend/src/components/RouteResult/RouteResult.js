import React from "react";

function RouteResult({ routeData }) {
  if (!routeData) return null;

  const { mode, distance_km, duration_min, carbon_grams, alternatives } = routeData;

  // Find the 'car' data to use as baseline for progress bars
  const carData = mode === "car"
    ? { carbon_grams, duration_min }
    : alternatives.find(a => a.mode === "car") || { carbon_grams: 0, duration_min: 0 };

  const maxCarbon = Math.max(carData.carbon_grams, 1);
  const offsetPercentage = Math.max(0, 100 - (carbon_grams / maxCarbon) * 100).toFixed(1);

  // Weighted Eco-Score algorithm using per-km ratios to prevent drops on long trips
  const emissionsPerKm = carbon_grams / Math.max(distance_km, 0.1);
  const timePerKm = duration_min / Math.max(distance_km, 0.1);
  const ecoScore = Math.max(0, 100 - (emissionsPerKm * 0.4) - (timePerKm * 0.1)).toFixed(1);

  return (
    <div className="glass-panel" style={{ padding: "30px", marginTop: "20px" }}>
      <h2 style={{ color: "#39ff14", letterSpacing: "1px", textTransform: "uppercase" }}>
        Selected Route: {mode.toUpperCase()}
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", margin: "20px 0", gap: "10px" }}>
        <div style={{ background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "8px", flex: "1", minWidth: "120px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#88c999", textTransform: "uppercase" }}>Distance</div>
          <div style={{ fontSize: "24px", color: "#fff", fontWeight: "bold" }}>{distance_km} <span style={{ fontSize: "16px" }}>km</span></div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "8px", flex: "1", minWidth: "120px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#88c999", textTransform: "uppercase" }}>Time</div>
          <div style={{ fontSize: "24px", color: "#fff", fontWeight: "bold" }}>{duration_min} <span style={{ fontSize: "16px" }}>mins</span></div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "8px", flex: "1", minWidth: "120px", textAlign: "center", border: "1px solid #39ff14" }}>
          <div style={{ fontSize: "12px", color: "#39ff14", textTransform: "uppercase" }}>Emissions</div>
          <div style={{ fontSize: "24px", color: "#39ff14", fontWeight: "bold" }}>{carbon_grams} <span style={{ fontSize: "16px" }}>g CO₂</span></div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "8px", flex: "1", minWidth: "120px", textAlign: "center", border: "1px solid #00f0ff" }}>
          <div style={{ fontSize: "12px", color: "#00f0ff", textTransform: "uppercase" }}>Eco-Score</div>
          <div style={{ fontSize: "24px", color: "#00f0ff", fontWeight: "bold" }}>{ecoScore}</div>
        </div>
      </div>

      <div style={{ margin: "25px 0" }}>
        <h4 style={{ color: "#88c999", margin: "0 0 10px 0" }}>
          {offsetPercentage <= 0.0 || mode === "car" ? "Carbon Baseline (Car Benchmark)" : `Carbon Offset vs Car (${offsetPercentage}% Greener)`}
        </h4>
        <div style={{ width: "100%", height: "12px", background: "rgba(0,0,0,0.5)", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{
            width: `${offsetPercentage}%`,
            height: "100%",
            background: "linear-gradient(90deg, #0cff0c, #39ff14)",
            boxShadow: "0 0 10px #39ff14",
            transition: "width 1s ease-in-out"
          }}></div>
        </div>
      </div>

      {alternatives && alternatives.length > 0 && (
        <>
          <h3 style={{ borderBottom: "1px solid rgba(57, 255, 20, 0.2)", paddingBottom: "10px", marginTop: "30px" }}>
            Compare Alternatives
          </h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {alternatives.map((alt) => {
              const deltaTime = alt.duration_min - duration_min;
              const deltaCarbon = alt.carbon_grams - carbon_grams;

              const timeColor = deltaTime > 0 ? "#ff5555" : "#39ff14";
              const carbonColor = deltaCarbon > 0 ? "#ff5555" : "#39ff14";

              return (
                <li key={alt.mode} style={{
                  padding: "15px",
                  margin: "10px 0",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <strong style={{ fontSize: "18px", textTransform: "capitalize", width: "80px" }}>{alt.mode}</strong>

                  <div style={{ display: "flex", gap: "20px", flex: 1, justifyContent: "flex-end" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "12px", color: "#88c999" }}>Time Delta</div>
                      <div style={{ color: timeColor, fontWeight: "bold" }}>
                        {deltaTime > 0 ? "+" : ""}{deltaTime} mins
                      </div>
                    </div>

                    <div style={{ textAlign: "right", minWidth: "120px" }}>
                      <div style={{ fontSize: "12px", color: "#88c999" }}>Carbon Delta</div>
                      <div style={{ color: carbonColor, fontWeight: "bold" }}>
                        {deltaCarbon > 0 ? "+" : ""}{deltaCarbon} g CO₂
                        {alt.carbon_grams == 0 && " ✨"}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default RouteResult;