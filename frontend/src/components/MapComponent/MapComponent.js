import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons not showing by default in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

function MapComponent({ routeData }) {
    if (!routeData) {
        return (
            <div className="glass-panel" style={{ padding: "10px", marginTop: "20px" }}>
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "400px", width: "100%", borderRadius: "8px" }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                    />
                </MapContainer>
            </div>
        );
    }

    const { startCoords, endCoords, geometry, mode } = routeData;

    // GeoJSON coordinates are in [lng, lat], but Leaflet Polyline expects [lat, lng]
    const positions = geometry.coordinates.map(coord => [coord[1], coord[0]]);

    const startPt = [startCoords.lat, startCoords.lng];
    const endPt = [endCoords.lat, endCoords.lng];
    const bounds = L.latLngBounds([startPt, endPt]);

    return (
        <div className="glass-panel" style={{ padding: "10px", marginTop: "20px" }}>
            <MapContainer bounds={bounds} style={{ height: "400px", width: "100%", borderRadius: "8px" }}>
                <ChangeView bounds={bounds} />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                />
                <Marker position={startPt}>
                    <Popup>Start Location</Popup>
                </Marker>
                <Marker position={endPt}>
                    <Popup>Destination</Popup>
                </Marker>
                {/* Neon Green Polyline */}
                <Polyline positions={positions} color="#39ff14" weight={6} opacity={0.8} />
            </MapContainer>
        </div>
    );
}

export default MapComponent;
