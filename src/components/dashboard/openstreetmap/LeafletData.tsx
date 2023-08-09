import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import useGetGeoPoints from "../../../hooks/dashboard/useGetGeopints";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FilterDashboard } from "../../../types/state";

interface IProps {
  state: FilterDashboard;
}

const LeafletData: React.FC<IProps> = (props) => {
  const { data, isLoading, refetch } = useGetGeoPoints(props.state);
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const [style, setStyle] = useState(
    currentTheme === "dark" ? "alidade_smooth_dark" : "alidade_smooth"
  );
  useEffect(() => {
    setStyle(
      currentTheme === "dark" ? "alidade_smooth_dark" : "alidade_smooth"
    );
  }, [currentTheme]);

  useEffect(() => {
    refetch();
  }, [props.state.st, props.state.en, props.state.search]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer
      className="full-height-map"
      center={[0, 0]}
      zoom={2}
      style={{ height: "400px", width: "100%", borderRadius: "16px" }}
      maxZoom={19}
      maxBounds={[
        [-85.06, -180],
        [85.06, 180],
      ]}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors'
        url={`https://tiles.stadiamaps.com/tiles/${style}/{z}/{x}/{y}{r}.png`}
      />
      <MarkerClusterGroup>
        {data?.data.features.map((arcade: any, index: number) => (
          <Marker
            key={`marker-${index}`}
            position={[
              arcade.geometry.coordinates[1],
              arcade.geometry.coordinates[0],
            ]}
          >
            <Popup>{arcade.properties.popupContent}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default LeafletData;
