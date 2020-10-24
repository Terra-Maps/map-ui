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
import makeBlockie from "ethereum-blockies-base64";
import { ApiService } from "../../service";

mapboxgl.accessToken = config.maps.MAP_BOX_ACCESS_TOKEN;

function MapComponent() {
  let mapContainer: any = "";
  const { lat, lng, zoom, walletInfo } = useContext<IStateModel>(StateContext);
  const { setMapLocation, toggleModal } = useContext<IActionModel>(
    ActionContext
  );
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [locationText, setLocationText] = useState<string>("");
  const [geocodingLocations, setGeocodingLocations] = useState<any[]>([]);
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
      console.log(evt);
    });

    newMap.on("load", async function () {
      setMap(newMap);
      const base64Chikara = btoa("chikaara");
      const populateMapPoints = await populateMapPoint(base64Chikara);
      populateMapPoints.map((points: any) =>
        new mapboxgl.Marker({ color: "#6c98e4" })
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
      center: [lng, lat],
      zoom: zoom + 1,
      bearing: 0,
      speed: 0.7, // make the flying slow
      curve: 1, // change the speed at which it zooms out
      easing: function (t) {
        return t;
      },
      essential: true,
    });
  };
  const zoomOut = () => {
    map?.flyTo({
      center: [lng, lat],
      zoom: zoom - 1,
      bearing: 0,
      speed: 0.7, // make the flying slow
      curve: 1, // change the speed at which it zooms out
      easing: function (t) {
        return t;
      },
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
          center: [
            Number.parseFloat(position.coords.longitude.toFixed(4)),
            Number.parseFloat(position.coords.latitude.toFixed(4)),
          ],
          zoom: 14,
          bearing: 0,
          speed: 1, // make the flying slow
          curve: 1, // change the speed at which it zooms out
          easing: function (t) {
            return t;
          },
          essential: true,
        });
      });
    }
  };

  const getGeocodeLocationCenter = (location: any) => {
    map?.flyTo({
      center: location.coordinates,
      zoom: 14,
      bearing: 0,
      speed: 1, // make the flying slow
      curve: 1, // change the speed at which it zooms out
      easing: function (t) {
        return t;
      },
      essential: true,
    });
  }

  useEffect(() => {
    return () => {
      navigator.geolocation.clearWatch(watchLocation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchLocation = (location: string) => {
    setLocationText(location);
    if(location) {
      ApiService.getGeocodeResult(encodeURIComponent(location)).then((result) => {
        const locations = result.features.map((feature: any) => ({place_name: feature.place_name, coordinates: feature.center}));
        setGeocodingLocations(locations);
      });
    } else {
      setGeocodingLocations([]);
    }
  };

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
        {!walletInfo ? (
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
        ) : (
          <div
            className="map-side-bar-item"
            onClick={() => {
              toggleModal({
                openModal: true,
                modalConfig: { type: "wallet" },
              });
            }}
          >
            <img
              src={makeBlockie(walletInfo.address)}
              alt="wallet-icon"
              className="wallet-blockie"
            />
          </div>
        )}
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
              onChange={(e) => searchLocation(e.target.value)}
              value={locationText}
            />
            <div
              className="map-search-close"
              onClick={(e) => setShowSearchLocation(false)}
            >
              <GrClose />
            </div>
          </div>
          <div className="map-search-list-container">
            <ul>
              {geocodingLocations.map((location, index) => (
                <li key={index} onClick={e => getGeocodeLocationCenter(location)}>{location.place_name}</li>
              ))}
            </ul>
          </div>
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
