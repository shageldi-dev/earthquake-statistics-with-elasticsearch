import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import Trees from "../../assets/trees.json";
import { Card } from "antd";
import "./maps.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import useGetGeoPoints from "@app/src/hooks/dashboard/useGetGeopints";
import { baseUrl } from "../../common/constant";
import { FilterDashboard } from "../../types/state";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hhZ2VsZGkiLCJhIjoiY2xoOHlyMDJhMDJiZzNlbnV1cTF6ZTV0OCJ9.m7LDf5BCVbkcKesIk2cFGg";

interface IProps {
  state: FilterDashboard;
}
const MapboxData: React.FC<IProps> = (props) => {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map>(null);
  const [lng, setLng] = useState(-79.9967309);
  const [lat, setLat] = useState(40.4366534);
  const [zoom, setZoom] = useState(1);

  // const { data, isLoading, error } = useGetGeoPoints();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error</div>;
  // }

  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  function renderMap() {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        currentTheme === "light"
          ? "mapbox://styles/shageldi/clkwbbev0004f01qsdw9e8r29"
          : "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    if (map && map.current) {
      map.current.on("move", () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });

      map.current.on("load", function () {
        map.current.addSource("trees", {
          type: "geojson",
          data: `${baseUrl}/search/earthquakes.geojson?start_date=${props.state.st}&end_date=${props.state.en}&search=${props.state.search}`,
        });

        map.current.addLayer(
          {
            id: "trees-heat" /* Reference id. */,
            type: "heatmap" /* Type of layer being created. */,
            source:
              "trees" /* Source of the layer's data, as referred to above in addSource() */,
            maxzoom: 15 /* Maximum zoom level for this layer. If exceeded, this layer will not be displayed. */,
            paint: {
              /* Increase weight as diameter breast height increases. */
              "heatmap-weight": {
                property: "dbh",
                type: "exponential",
                stops: [
                  [1, 0],
                  [62, 1],
                ],
              },
              /* Increase intensity as zoom level increases. */
              "heatmap-intensity": {
                stops: [
                  [11, 1],
                  [15, 3],
                ],
              },
              /* Use sequential color palette to use exponentially as the weight increases. */
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(236,222,239,0)",
                0.2,
                "rgb(208,209,230)",
                0.4,
                "rgb(166,189,219)",
                0.6,
                "rgb(103,169,207)",
                0.8,
                "rgb(28,144,153)",
              ],
              /* Increase radius as zoom increases. */
              "heatmap-radius": {
                stops: [
                  [11, 15],
                  [15, 20],
                ],
              },
              /* Decrease opacity to transition into the circle layer. */
              "heatmap-opacity": {
                default: 1,
                stops: [
                  [14, 1],
                  [15, 0],
                ],
              },
            },
          },
          "waterway-label"
        ); /* The layer just described will go above the waterway-label. */

        /* When zoomed in closely, the heat map disperses into points. This is the layer for points. */
        map.current.addLayer(
          {
            id: "trees-point",
            type: "circle",
            source: "trees",
            minzoom: 14,
            paint: {
              /* Increase the radius of the circle as the zoom level and dbh value increases.
                The following three categories attribute different properties to the circles and zoom. */
              "circle-radius": {
                property: "dbh",
                type: "exponential",
                stops: [
                  [{ zoom: 15, value: 1 }, 5],
                  [{ zoom: 15, value: 62 }, 10],
                  [{ zoom: 22, value: 1 }, 20],
                  [{ zoom: 22, value: 62 }, 50],
                ],
              },
              "circle-color": {
                property: "dbh",
                type: "exponential",
                stops: [
                  [0, "rgba(236,222,239,0)"],
                  [10, "rgb(236,222,239)"],
                  [20, "rgb(208,209,230)"],
                  [30, "rgb(166,189,219)"],
                  [40, "rgb(103,169,207)"],
                  [50, "rgb(28,144,153)"],
                  [60, "rgb(1,108,89)"],
                ],
              },
              "circle-stroke-color": "white",
              "circle-stroke-width": 1,
              "circle-opacity": {
                stops: [
                  [14, 0],
                  [15, 1],
                ],
              },
            },
          },
          "waterway-label"
        ); /* Goes above the waterway-label. */
      });

      //   map.current.on("click", "trees-point", function (e) {
      //     console.log(e);
      //     new mapboxgl.Popup()
      //       .setLngLat(
      //         e.features[0].geometry.coordinates
      //       ) /* Find & set the coordinates for the pop-up. */
      //       .setHTML(
      //         "<b>DBH:</b> " + e.features[0].properties.dbh
      //       ) /* Set and add the HTML to the pop-up. */
      //       .addTo(map.current); /* Add layer to the map. */
      //   });
    }
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    renderMap();
  });

  useEffect(() => {
    map.current.remove();
    renderMap();
  }, [currentTheme, props.state.st, props.state.en, props.state.search]);
  return (
    <Card>
      <div ref={mapContainer} className="map-container" />
    </Card>
  );
};

export default MapboxData;
