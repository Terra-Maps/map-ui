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
import Switch from "react-switch";
import "./index.d";
import algosdk from "algosdk";
import Geohash from "latlon-geohash";
import makeBlockie from "ethereum-blockies-base64";
import { ApiService } from "../../service";
import { AddPointForm, ProfileDropdown, ViewPointForm } from "./components";

mapboxgl.accessToken = config.maps.MAP_BOX_ACCESS_TOKEN;

function MapComponent() {
  let mapContainer: any = "";
  const { lat, lng, zoom, walletInfo, user } = useContext<IStateModel>(
    StateContext
  );
  const { setMapLocation, toggleModal } = useContext<IActionModel>(
    ActionContext
  );
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [locationText, setLocationText] = useState<string>("");
  const [geocodingLocations, setGeocodingLocations] = useState<any[]>([]);
  const [showSearchLocation, setShowSearchLocation] = useState<boolean>(false);
  const [showLeftSideBar, setShowLeftSideBar] = useState<boolean>(false);
  const [addPOIConfig, setAddPOIConfig] = useState<any>(null);
  const [addPOIMode, setAddPOIMode] = useState<boolean>(false);
  const [sidebarAddPOIMode, setSidebarAddPOIMode] = useState<boolean>(true);
  const [viewPOIConfig, setViewPOIConfig] = useState<any>(null);
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);


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

    newMap.on("load", async function () {
      setMap(newMap);
      loadMapPoi(newMap);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapClickListener = (evt: any) => {
    const geohash = Geohash.encode(
      evt.lngLat.lat,
      evt.lngLat.lng,
      evt.target.getZoom()
    );
    setAddPOIConfig({
      geohash,
      latlng: { lat: evt.lngLat.lat, lng: evt.lngLat.lng },
      zoom: evt.target.getZoom(),
    });
    setSidebarAddPOIMode(true);
    setShowLeftSideBar(true);
  };

  const loadMapPoi = async (map: mapboxgl.Map) => {
    const base64Chikara = btoa("chikaara");
    const populateMapPoints = await populateMapPoint(base64Chikara);
    if (map) {
      populateMapPoints.map((points: any) => {
        const marker = new mapboxgl.Marker({ color: "#6c98e4" })
          .setLngLat([points.latlng.lon, points.latlng.lat])
          .addTo(map);
        marker.getElement().addEventListener("click", function (e) {
          e.stopPropagation();
          console.log(points);
          setSidebarAddPOIMode(false);
          setViewPOIConfig(points);
          setShowLeftSideBar(true);
        });
        return marker;
      });
    }
  };

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
    const pointGeoPoints = assetInfo.transactions.map((transaction: any) => {
      try {
        return atob(transaction.note).split("-")[2]
          ? JSON.parse(atob(transaction.note).split("-")[2])
          : undefined;
      } catch (err) {
        console.log(err);
        return undefined;
      }
    });
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
          center: [position.coords.longitude, position.coords.latitude],
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
  };

  useEffect(() => {
    return () => {
      navigator.geolocation.clearWatch(watchLocation);
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchLocation = (location: string) => {
    setLocationText(location);
    if (location) {
      ApiService.getGeocodeResult(encodeURIComponent(location)).then(
        (result) => {
          const locations = result.features.map((feature: any) => ({
            place_name: feature.place_name,
            coordinates: feature.center,
          }));
          setGeocodingLocations(locations);
        }
      );
    } else {
      setGeocodingLocations([]);
    }
  };

  const refreshMap = () => {
    if (map) {
      console.log(map);
      setTimeout(() => {
        loadMapPoi(map);
      }, 15000);
    }
  };

  const changeAddPOIMode = (checked: boolean) => {
    console.log(checked);
    if (checked) {
      map?.on("click", mapClickListener);
      map?.flyTo({
        center: [lng, lat],
        zoom: 15,
        bearing: 0,
        speed: 0.7, // make the flying slow
        curve: 1, // change the speed at which it zooms out
        easing: function (t) {
          return t;
        },
        essential: true,
      });
    } else {
      console.log("Enter", map);
      map?.getCanvasContainer().removeEventListener("click", mapClickListener);
      // map?.off("click", mapClickListener);
      map?.flyTo({
        center: [lng, lat],
        zoom: 4,
        bearing: 0,
        speed: 0.7, // make the flying slow
        curve: 1, // change the speed at which it zooms out
        easing: function (t) {
          return t;
        },
        essential: true,
      });
    }
    setAddPOIMode(checked);
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
                modalConfig: { type: "wallet-details" },
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
                <li
                  key={index}
                  onClick={(e) => getGeocodeLocationCenter(location)}
                >
                  {location.place_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div ref={(el) => (mapContainer = el)} className="mapContainer" />

      <div className="map-left-side-bar">
        <div className="map-auth-container">
          {!user ? (
            <>
              <button
                className="login-button"
                onClick={(e) =>
                  toggleModal({
                    openModal: true,
                    modalConfig: { type: "login" },
                  })
                }
              >
                Login
              </button>
            </>
          ) : (
            <img
              src={user?.picture}
              alt="address-blockie"
              className="user-profile-blockie-icon"
              height={42}
              width={42}
              loading="lazy"
              onClick={e => setShowProfileDropdown(true)}
            />
          )}
          {showProfileDropdown && (
            <ProfileDropdown setShowDropdown={setShowProfileDropdown} />
          )}
        </div>
        {sidebarAddPOIMode
          ? showLeftSideBar && (
              <AddPointForm
                addPOIConfig={addPOIConfig}
                setShowLeftSideBar={(flag) => setShowLeftSideBar(flag)}
                setAddPOIConfig={(config) => setAddPOIConfig(config)}
                refreshMap={() => refreshMap()}
              />
            )
          : showLeftSideBar && (
              <ViewPointForm
                viewPOIConfig={viewPOIConfig}
                setShowLeftSideBar={(flag) => setShowLeftSideBar(flag)}
                setViewPOIConfig={(config) => setViewPOIConfig(config)}
              />
            )}
      </div>
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
        <div className="add-poi-mode-actions">
          <div className="add-poi-title">Cartographer Mode</div>
          <div className="add-poi-switch">
            <Switch
              checked={addPOIMode}
              onChange={(checked) => changeAddPOIMode(checked)}
              onColor="#a2c4ff"
              onHandleColor="#6c98e4"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={20}
              width={48}
              className="react-switch"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
