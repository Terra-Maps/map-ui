export const randomStringGen = (length: number) => {
  var chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

export const addPaddingToGeohash = (geohash: string) => {
  if (geohash.length < 12) {
    let geoLen = geohash.length;
    var paddingLen = 12 - geoLen;
    let newGeohash = geohash + "o".repeat(paddingLen);
    console.log(newGeohash, "newGeohash");

    return newGeohash;
  }

  return geohash;
};

export const convertToHex = (address: string) => {
  let result = "";
  for (let i = 0; i < address.length; i++) {
    const hex = address.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : "0" + hex;
  }
  return result;
};

export const convertFromHex = (str: string) => {
  let result = "";
  for (let i = 0; i < str.length; i += 2) {
    const hex = String.fromCharCode(
      parseInt("0x" + str.substring(i, i + 2), 16)
    );
    result += hex;
  }
  return result;
};

export const base64ToHex = (str: string) => {
  const raw = atob(str);
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : "0" + hex;
  }
  return result;
};

export const stringToUint = (field: string) => {
  const charList = field.split("");
  const uintArray = [];
  for (var i = 0; i < charList.length; i++) {
    uintArray.push(charList[i].charCodeAt(0));
  }
  return new Uint8Array(uintArray);
};
