export const randomStringGen = (length: number) => {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export const addPaddingToGeohash = (geohash: string) => {
    if(geohash.length < 12) {
      let geoLen = geohash.length
      var paddingLen = 12 - geoLen;
      let newGeohash = geohash + "o".repeat(paddingLen)
      console.log(newGeohash, 'newGeohash')

      return newGeohash
    }

    return geohash
}