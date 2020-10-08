import React, { useContext, useEffect } from "react";
import "./MapComponent.scss";
import mapboxgl from "mapbox-gl";
import { ActionContext, StateContext } from "../../hooks";
import { IActionModel, IStateModel } from "../../model/hooks.model";
import { MdGpsFixed } from "react-icons/md";
import { FaLayerGroup, FaSearchLocation } from "react-icons/fa";
import { FiPlus, FiMinus } from "react-icons/fi";
import config from "../../config";
// import locationImg from "../../assets/png/location.png";
import "./index.d";
import algosdk from "algosdk";
import Geohash from "latlon-geohash";

mapboxgl.accessToken = config.maps.MAP_BOX_ACCESS_TOKEN;

function MapComponent() {
  let mapContainer: any;
  const { lat, lng, zoom } = useContext<IStateModel>(StateContext);
  const { setMapLocation } = useContext<IActionModel>(ActionContext);
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/rekpero/ckg0xd0md1mz119s0ifc5z0xj",
      center: [lng, lat],
      zoom: zoom,
    });

    map.on("move", () => {
      console.log("Enter");
      setMapLocation(
        Number.parseFloat(map.getCenter().lat.toFixed(4)),
        Number.parseFloat(map.getCenter().lng.toFixed(4)),
        Number.parseFloat(map.getZoom().toFixed(2))
      );
    });

    map.on("load", async function () {
      // Add an image to use as a custom marker
      //   map.loadImage(locationImg, async function (error: Error, image: any) {
      //     if (error) throw error;
      //     map.addImage("custom-marker", image);
      //     // Add a GeoJSON source with 2 points
      //     const base64Chikara = btoa("chikaara");
      //     const populateLatLng = await populateMapPoint(base64Chikara);

      //     console.log(
      //       populateLatLng.map((latLng: any) => {
      //         console.log("LatLng", latLng);
      //         return {
      //           // feature for Mapbox DC
      //           type: "Feature",
      //           geometry: {
      //             type: "Point",
      //             coordinates: [latLng.lng, latLng.lat],
      //           },
      //           properties: {},
      //         };
      //       })
      //     );
      //     map.addSource("points", {
      //       type: "geojson",
      //       data: {
      //         type: "FeatureCollection",
      //         features: populateLatLng.map((latLng: any) => {
      //           console.log("LatLng", latLng);
      //           return {
      //             // feature for Mapbox DC
      //             type: "Feature",
      //             geometry: {
      //               type: "Point",
      //               coordinates: [75.734, 26.9357],
      //             },
      //             properties: {},
      //           };
      //         }),
      //       },
      //     });

      //     // Add a symbol layer
      //     map.addLayer({
      //       id: "points",
      //       type: "symbol",
      //       source: "points",
      //       layout: {
      //         "icon-image": "custom-marker",
      //         "icon-size": 0.075,
      //         // get the title name from the source's "title" property
      //         "text-field": ["get", "title"],
      //         "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      //         "text-offset": [0, 1.25],
      //         "text-anchor": "top",
      //       },
      //       paint: {
      //         "text-color": "#ffffff",
      //       },
      //     });
      //   });

      const base64Chikara = btoa("chikaara");
      const populateMapPoints = await populateMapPoint(base64Chikara);
      populateMapPoints.map((points: any) =>
        new mapboxgl.Marker()
          .setLngLat([points.latlng.lon, points.latlng.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h4>${points.nm}</h4>`))
          .addTo(map)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const populateMapPoint = async (base64Chikara: string) => {
    console.log();
    const token = {
      "X-API-key": "fmprdjLHAM5gfosJUVND49NtPKHEf8dz4CQu0VTY",
    };
    const baseServer = "https://testnet-algorand.api.purestake.io/idx2";
    const port = "";

    let indexerClient = new algosdk.Indexer(token, baseServer, port);
    let assetInfo = await indexerClient
      .searchForTransactions()
      .assetID(12743544)
      .notePrefix(base64Chikara)
      .do();
    console.log(assetInfo);
    const pointGeoPoints = assetInfo.transactions.map((transaction: any) =>
      atob(transaction.note).split("-")[2]
        ? JSON.parse(atob(transaction.note).split("-")[2])
        : undefined
    );
    console.log(pointGeoPoints);
    const pointLatLong = pointGeoPoints.map((point: any) => {
      try {
        return { ...point, latlng: Geohash.decode(point.gh) };
      } catch (err) {
        console.log(err);
      }
      return undefined;
    });
    const pointLatLongFiltered = pointLatLong.filter((latLng: any) => latLng);
    console.log(pointLatLongFiltered);
    return pointLatLongFiltered;
  };
  return (
    <div className="MapComponent">
      <div className="map-side-bar">
        <div className="map-side-bar-item">
          <FaSearchLocation />
        </div>
        <div className="map-side-bar-item">
          <FaLayerGroup />
        </div>
      </div>
      <div ref={(el) => (mapContainer = el)} className="mapContainer" />
      <div className="map-location-bottom-container">
        <div className="map-location-details">
          <div className="map-location-inner">
            <div className="map-location-item">
              <span>{lat}</span>
              <span className="map-location-superscript">Lat</span>
            </div>
            <div className="map-location-item">
              <span>{lng}</span>
              <span className="map-location-superscript">Lng</span>
            </div>
            <div className="map-location-item">
              <span>{zoom}</span>
              <span className="map-location-superscript">Zoom</span>
            </div>
          </div>
        </div>
        <div className="map-location-actions">
          <div className="map-location-action-item">
            <FiPlus />
          </div>
          <div className="map-location-action-item">
            <FiMinus />
          </div>
          <div className="map-location-action-item">
            <MdGpsFixed />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
