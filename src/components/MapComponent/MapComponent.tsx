import React, { useContext, useEffect, useState } from "react";
import "./MapComponent.scss";
import mapboxgl from "mapbox-gl";
import { ActionContext, StateContext } from "../../hooks";
import { IActionModel, IStateModel } from "../../model/hooks.model";
import { MdGpsFixed } from "react-icons/md";
import { FaLayerGroup, FaSearchLocation, FaWallet } from "react-icons/fa";
import { FiPlus, FiMinus } from "react-icons/fi";
import { BsSearch } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import config from "../../config";
// import locationImg from "../../assets/png/location.png";
import "./index.d";
import algosdk from "algosdk";
import Geohash from "latlon-geohash";

mapboxgl.accessToken = config.maps.MAP_BOX_ACCESS_TOKEN;

function MapComponent() {
  let mapContainer: any = "";
  const { lat, lng, zoom } = useContext<IStateModel>(StateContext);
  const { setMapLocation, toggleModal } = useContext<IActionModel>(
    ActionContext
  );
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [showSearchLocation, setShowSearchLocation] = useState<boolean>(false);
  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/rekpero/ckg0xd0md1mz119s0ifc5z0xj",
      center: [lng, lat],
      zoom: zoom,
    });

    newMap.on("move", () => {
      setMapLocation(
        Number.parseFloat(newMap.getCenter().lat.toFixed(4)),
        Number.parseFloat(newMap.getCenter().lng.toFixed(4)),
        Number.parseFloat(newMap.getZoom().toFixed(2))
      );
    });

    newMap.on("click", (evt) => {
      console.log(evt)
    });

    newMap.on("load", async function () {
      setMap(newMap);
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
        new mapboxgl.Marker({ "color": "#6c98e4" })
          .setLngLat([points.latlng.lon, points.latlng.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h4>${points.nm}</h4>`))
          .addTo(newMap)
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
  const zoomIn = () => {
    map?.flyTo({
      // These options control the ending camera position: centered at
      // the target, at zoom level 9, and north up.
      center: [lng, lat],
      zoom: zoom + 1,
      bearing: 0,

      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 0.7, // make the flying slow
      curve: 1, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: function (t) {
        return t;
      },

      // this animation is considered essential with respect to prefers-reduced-motion
      essential: true,
    });
  };
  const zoomOut = () => {
    map?.flyTo({
      // These options control the ending camera position: centered at
      // the target, at zoom level 9, and north up.
      center: [lng, lat],
      zoom: zoom - 1,
      bearing: 0,

      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 0.7, // make the flying slow
      curve: 1, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: function (t) {
        return t;
      },

      // this animation is considered essential with respect to prefers-reduced-motion
      essential: true,
    });
  };

  let watchLocation: any = null;

  const showCurrentLocation = () => {
    console.log("Enter");
    if ("geolocation" in navigator) {
      watchLocation = navigator.geolocation.getCurrentPosition((position) => {
        setMapLocation(
          Number.parseFloat(position.coords.latitude.toFixed(4)),
          Number.parseFloat(position.coords.longitude.toFixed(4)),
          Number.parseFloat("14")
        );
        map?.flyTo({
          // These options control the ending camera position: centered at
          // the target, at zoom level 9, and north up.
          center: [
            Number.parseFloat(position.coords.longitude.toFixed(4)),
            Number.parseFloat(position.coords.latitude.toFixed(4)),
          ],
          zoom: 14,
          bearing: 0,

          // These options control the flight curve, making it move
          // slowly and zoom out almost completely before starting
          // to pan.
          speed: 1, // make the flying slow
          curve: 1, // change the speed at which it zooms out

          // This can be any easing function: it takes a number between
          // 0 and 1 and returns another number between 0 and 1.
          easing: function (t) {
            return t;
          },

          // this animation is considered essential with respect to prefers-reduced-motion
          essential: true,
        });
      });
    }
  };

  useEffect(() => {
    return () => {
      navigator.geolocation.clearWatch(watchLocation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="MapComponent">
      <div className="map-side-bar">
        <div
          className="map-side-bar-item"
          onClick={(e) => setShowSearchLocation(true)}
        >
          <FaSearchLocation />
        </div>
        <div className="side-bar-flex-total">
          <div className="map-side-bar-item">
            <FaLayerGroup />
          </div>
        </div>
        <div
          className="map-side-bar-item"
          onClick={() => {
            toggleModal({
              openModal: true,
              modalConfig: { type: "wallet" },
            });
          }}
        >
          <FaWallet />
        </div>
      </div>
      {showSearchLocation && (
        <div className="map-search-container">
          <div className="map-search-input-container">
            <div className="map-search-icon-container">
              <BsSearch />
            </div>
            <input
              type="search"
              placeholder="Search Location"
              className="map-search-input"
            />
            <div
              className="map-search-close"
              onClick={(e) => setShowSearchLocation(false)}
            >
              <GrClose />
            </div>
          </div>
          {/* <div className="map-search-list-container">
          <ul>
            <li>Taj mahal, Agra</li>
            <li>Taj Mahal Restaurant, Agra</li>
            <li>Taj Mahal Hotel, Agra</li>
            <li>Taj Mahal Resort, Jaipur</li>
            <li>Hotel Taj Mahal, New Delhi</li>
          </ul>
        </div> */}
        </div>
      )}
      <div ref={(el) => (mapContainer = el)} className="mapContainer" />
      <div className="map-location-bottom-container">
        <div className="map-location-details">
          <div className="map-location-inner">
            <div className="map-location-item">
              <span>{lat.toFixed(4)}</span>
              <span className="map-location-superscript">Lat</span>
            </div>
            <div className="map-location-item">
              <span>{lng.toFixed(4)}</span>
              <span className="map-location-superscript">Lng</span>
            </div>
            <div className="map-location-item">
              <span>{zoom.toFixed(2)}</span>
              <span className="map-location-superscript">Zoom</span>
            </div>
          </div>
        </div>
        <div className="map-location-actions">
          <div className="map-location-action-item" onClick={zoomIn}>
            <FiPlus />
          </div>
          <div className="map-location-action-item" onClick={zoomOut}>
            <FiMinus />
          </div>
          <div
            className="map-location-action-item"
            onClick={showCurrentLocation}
          >
            <MdGpsFixed />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
