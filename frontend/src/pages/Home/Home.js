import React, { useState } from "react";
import Header from "../../components/Header/Header";
import RouteForm from "../../components/RouteForm/RouteForm";
import RouteResult from "../../components/RouteResult/RouteResult";
import MapComponent from "../../components/MapComponent/MapComponent";
import Footer from "../../components/Footer/Footer";

function Home() {
  const [routeData, setRouteData] = useState(null);

  return (
    <div>
      <Header />
      <RouteForm setRouteData={setRouteData} />

      {/* Dynamic Green Map */}
      <MapComponent routeData={routeData} />

      <RouteResult routeData={routeData} />
      <Footer />
    </div>
  );
}

export default Home;