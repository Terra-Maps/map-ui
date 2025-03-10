import config from "../config";

export const getGeocodeResult = (location: string) =>
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${config.maps.MAP_BOX_ACCESS_TOKEN}`
  ).then((res) => res.json());

export const getAlgoUsdExchange = () =>
  fetch(`https://api.coinranking.com/v1/public/coin/14585`).then((res) =>
    res.json()
  );