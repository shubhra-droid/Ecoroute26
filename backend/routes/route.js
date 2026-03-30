const express = require("express");
const axios = require("axios");
const calculateCarbon = require("../utils/carbon");

const router = express.Router();

const geocode = async (place) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place + ", India")}&format=json&limit=1`;

    const res = await axios.get(url, {
      headers: { "User-Agent": "Ecoroute25-App" },
      timeout: 10000
    });

    if (!res.data || res.data.length === 0) return null;

    const lat = parseFloat(res.data[0].lat);
    const lng = parseFloat(res.data[0].lon);

    return { lat, lng };
  } catch (err) {
    console.error("Geocode failed for:", place, err.message);
    return null;
  }
};

router.post("/route", async (req, res) => {
  const { start, end, mode } = req.body;

  if (!start || !end || !mode) {
    return res.status(400).json({ error: "Missing start, end, or mode" });
  }

  console.log(`Geocoding: "${start}" and "${end}"`);

  const startCoords = await geocode(start);
  if (!startCoords) {
    return res.status(400).json({ error: `Could not find location: ${start}. Try adding state name e.g. "Mumbai, Maharashtra"` });
  }
  console.log("Start coords:", startCoords);

  await new Promise((r) => setTimeout(r, 1000));

  const endCoords = await geocode(end);
  if (!endCoords) {
    return res.status(400).json({ error: `Could not find location: ${end}. Try adding state name e.g. "Bangalore, Karnataka"` });
  }
  console.log("End coords:", endCoords);

  const profileMap = {
    car: "driving",
    bus: "driving",
    metro: "driving",
    bike: "cycling",
    walk: "foot",
  };
  const osrmProfile = profileMap[mode] || "driving";

  const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmProfile}/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson`;

  try {
    const response = await axios.get(osrmUrl);
    const route = response.data.routes[0];

    const distance_km = (route.distance / 1000).toFixed(2);
    let duration_min = Math.round(route.duration / 60);

    // We need to estimate car duration to use as a base for alternatives
    let baseCarDuration = duration_min;
    if (mode === "bike") baseCarDuration = duration_min / 3;
    else if (mode === "walk") baseCarDuration = duration_min / 10;

    // Adjust the main duration_min for the currently selected mode if it's a proxy profile
    if (mode === "bus") duration_min = Math.round(baseCarDuration * 1.5);
    if (mode === "metro") duration_min = Math.round(baseCarDuration * 1.2);

    const carbon_grams = calculateCarbon(route.distance, mode).toFixed(0);

    const alternatives = ["car", "bus", "bike", "walk", "metro"]
      .filter((m) => m !== mode)
      .map((m) => ({
        mode: m,
        carbon_grams: calculateCarbon(route.distance, m).toFixed(0),
        duration_min:
          m === "bike" ? Math.round(baseCarDuration * 3) :
            m === "walk" ? Math.round(baseCarDuration * 10) :
              m === "bus" ? Math.round(baseCarDuration * 1.5) :
                m === "metro" ? Math.round(baseCarDuration * 1.2) :
                  Math.round(baseCarDuration)
      }));

    res.json({
      mode,
      distance_km,
      duration_min,
      carbon_grams,
      alternatives,
      geometry: route.geometry,
      startCoords,
      endCoords
    });

  } catch (err) {
    console.error("Routing error:", err.message);
    res.status(500).json({ error: "Routing failed" });
  }
});

module.exports = router;